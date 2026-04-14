using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using SmartSpend.Backend.DTOs;

namespace SmartSpend.Backend.Services;

public interface IGeminiReceiptOcrService
{
    Task<ReceiptOcrResultDto> ExtractReceiptAsync(IFormFile receipt, CancellationToken cancellationToken);
}

public class GeminiReceiptOcrService : IGeminiReceiptOcrService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public GeminiReceiptOcrService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<ReceiptOcrResultDto> ExtractReceiptAsync(IFormFile receipt, CancellationToken cancellationToken)
    {
        var apiKey = _configuration["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("Gemini API key is not configured.");

        var model = _configuration["Gemini:Model"] ?? "gemini-2.5-flash";
        var imageBase64 = await ToBase64Async(receipt, cancellationToken);

        var payload = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new
                        {
                            inline_data = new
                            {
                                mime_type = receipt.ContentType,
                                data = imageBase64
                            }
                        },
                        new
                        {
                            text = """
                            Extract expense data from this receipt image for SmartSpend.
                            Return the best JSON values only. Use INR when currency is unclear.
                            Use yyyy-MM-dd for date. If a field is missing, use an empty string or null amount.
                            Category must be one of: Food & Dining, HealthCare, Travel & Trips, Personal Care, Entertainment, Rent/Housing, Education, Travel, Shopping, Bills, Groceries, Others.
                            Description should be short and useful for an expense list, such as merchant plus purpose.
                            RawText should contain the important receipt text in compact form.
                            """
                        }
                    }
                }
            },
            generationConfig = new
            {
                responseMimeType = "application/json",
                responseJsonSchema = new
                {
                    type = "object",
                    properties = new
                    {
                        merchant = new { type = "string" },
                        description = new { type = "string" },
                        amount = new { type = new[] { "number", "null" } },
                        category = new
                        {
                            type = "string",
                            @enum = new[]
                            {
                                "Food & Dining",
                                "HealthCare",
                                "Travel & Trips",
                                "Personal Care",
                                "Entertainment",
                                "Rent/Housing",
                                "Education",
                                "Travel",
                                "Shopping",
                                "Bills",
                                "Groceries",
                                "Others"
                            }
                        },
                        date = new { type = "string" },
                        currency = new { type = "string" },
                        rawText = new { type = "string" }
                    },
                    required = new[] { "merchant", "description", "amount", "category", "date", "currency", "rawText" }
                }
            }
        };

        using var response = await SendGeminiRequestAsync(model, apiKey, payload, cancellationToken);
        var responseText = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException(GetGeminiErrorMessage(response.StatusCode, responseText));

        var geminiResponse = JsonSerializer.Deserialize<GeminiGenerateContentResponse>(responseText, JsonOptions);
        var json = geminiResponse?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;

        if (string.IsNullOrWhiteSpace(json))
            throw new InvalidOperationException("Gemini did not return receipt data.");

        var result = JsonSerializer.Deserialize<ReceiptOcrResultDto>(json, JsonOptions);
        if (result == null)
            throw new InvalidOperationException("Unable to parse Gemini receipt data.");

        return result;
    }

    private async Task<HttpResponseMessage> SendGeminiRequestAsync(
        string model,
        string apiKey,
        object payload,
        CancellationToken cancellationToken)
    {
        var transientDelays = new[]
        {
            TimeSpan.FromSeconds(1),
            TimeSpan.FromSeconds(2),
            TimeSpan.FromSeconds(4)
        };

        for (var attempt = 0; ; attempt++)
        {
            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent")
            {
                Content = JsonContent.Create(payload)
            };
            request.Headers.Add("x-goog-api-key", apiKey);

            var response = await _httpClient.SendAsync(request, cancellationToken);

            if (!IsTransientGeminiFailure(response.StatusCode) || attempt >= transientDelays.Length)
                return response;

            response.Dispose();
            await Task.Delay(transientDelays[attempt], cancellationToken);
        }
    }

    private static bool IsTransientGeminiFailure(HttpStatusCode statusCode)
    {
        return statusCode == HttpStatusCode.TooManyRequests ||
               statusCode == HttpStatusCode.BadGateway ||
               statusCode == HttpStatusCode.ServiceUnavailable ||
               statusCode == HttpStatusCode.GatewayTimeout;
    }

    private static string GetGeminiErrorMessage(HttpStatusCode statusCode, string responseText)
    {
        if (IsTransientGeminiFailure(statusCode))
            return "Gemini is busy right now. Please wait a moment and scan the receipt again.";

        return $"Gemini OCR failed: {responseText}";
    }

    private static async Task<string> ToBase64Async(IFormFile receipt, CancellationToken cancellationToken)
    {
        await using var stream = receipt.OpenReadStream();
        using var memoryStream = new MemoryStream();
        await stream.CopyToAsync(memoryStream, cancellationToken);
        return Convert.ToBase64String(memoryStream.ToArray());
    }

    private sealed class GeminiGenerateContentResponse
    {
        public List<GeminiCandidate>? Candidates { get; set; }
    }

    private sealed class GeminiCandidate
    {
        public GeminiContent? Content { get; set; }
    }

    private sealed class GeminiContent
    {
        public List<GeminiPart>? Parts { get; set; }
    }

    private sealed class GeminiPart
    {
        public string? Text { get; set; }
    }
}
