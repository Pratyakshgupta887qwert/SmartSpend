namespace SmartSpend.Backend.Services;

public static class JwtConfiguration
{
    private const string PlaceholderSecret = "SET_THIS_VIA_DOTNET_USER_SECRETS";

    private const string DevelopmentFallbackSecret =
        "SmartSpend-Development-Only-JWT-Secret-For-Local-Clone-And-Run-2026";

    public static string GetSecret(IConfiguration configuration, IHostEnvironment environment)
    {
        var secret = configuration["JwtSettings:Secret"];

        if (!string.IsNullOrWhiteSpace(secret) && secret != PlaceholderSecret)
            return secret;

        if (environment.IsDevelopment())
            return DevelopmentFallbackSecret;

        throw new InvalidOperationException("JWT Secret is missing. Set JwtSettings:Secret before running the API.");
    }
}
