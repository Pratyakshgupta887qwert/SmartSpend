using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSpend.Backend.Services;

namespace SmartSpend.Backend.Controllers;

[Route("api/receipt-ocr")]
[ApiController]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class ReceiptOcrController : ControllerBase
{
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif"
    };

    private readonly IGeminiReceiptOcrService _geminiReceiptOcrService;

    public ReceiptOcrController(IGeminiReceiptOcrService geminiReceiptOcrService)
    {
        _geminiReceiptOcrService = geminiReceiptOcrService;
    }

    [HttpPost("extract")]
    public async Task<IActionResult> Extract([FromForm] IFormFile receipt, CancellationToken cancellationToken)
    {
        if (receipt == null || receipt.Length == 0)
            return BadRequest("Please upload a receipt image.");

        if (!AllowedContentTypes.Contains(receipt.ContentType))
            return BadRequest("Only JPEG, PNG, WEBP, HEIC, and HEIF receipt images are supported.");

        if (receipt.Length > 8 * 1024 * 1024)
            return BadRequest("Receipt image size must be 8MB or less.");

        try
        {
            var result = await _geminiReceiptOcrService.ExtractReceiptAsync(receipt, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(StatusCodes.Status502BadGateway, ex.Message);
        }
    }
}
