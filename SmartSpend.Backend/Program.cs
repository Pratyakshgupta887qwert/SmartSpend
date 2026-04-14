using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using SmartSpend.Backend.Data;
using SmartSpend.Backend.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SmartSpend API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token like: Bearer {your token}"
    });

    options.AddSecurityRequirement(openApiDocument => new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecuritySchemeReference("Bearer", openApiDocument),
            new List<string>()
        }
    });
});
builder.Services.AddControllers();
builder.Services.AddScoped<JwtService>();
builder.Services.AddHttpClient<IGeminiReceiptOcrService, GeminiReceiptOcrService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
var hasGoogleAuth = !string.IsNullOrWhiteSpace(googleClientId) &&
                    !string.IsNullOrWhiteSpace(googleClientSecret);

var authenticationBuilder = builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = "Cookies";
        options.DefaultChallengeScheme = hasGoogleAuth
            ? GoogleDefaults.AuthenticationScheme
            : JwtBearerDefaults.AuthenticationScheme;
    })
    .AddCookie("Cookies")
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("JwtSettings");
        var secretKey = JwtConfiguration.GetSecret(builder.Configuration, builder.Environment);

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey)
            )
        };
    });

if (hasGoogleAuth)
{
    authenticationBuilder.AddGoogle(options =>
    {
        options.SignInScheme = "Cookies";
        options.ClientId = googleClientId!;
        options.ClientSecret = googleClientSecret!;
        options.CallbackPath = "/signin-google";
    });
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Allowed Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();
app.UseCors("Allowed Frontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
