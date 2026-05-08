using Microsoft.EntityFrameworkCore;
using TiendasAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TiendasAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURACIÓN DE SERVICIOS ---

builder.Services.AddScoped<JwtService>();

// 🔑 Configuración de JWT desde appsettings.json
var jwtConfig = builder.Configuration.GetSection("Jwt");

// 🔌 Cadena de conexión a SQL Server
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 🧩 Controladores y configuración de JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔐 Seguridad: Autenticación JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig["Issuer"],
            ValidAudience = jwtConfig["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Key"])),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// 🌍 Política de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors("AllowAll");

// --- 2. BLOQUE DE AUTOCREACIÓN DE BASE DE DATOS ---
// Este código activa la base de datos automáticamente sin comandos de terminal.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        // Crea la base de datos y las tablas si no existen
        context.Database.EnsureCreated();
        Console.WriteLine("**********************************************************");
        Console.WriteLine("✅ PROYECTO LISTO: Base de datos CafeAirRodCoffe activada.");
        Console.WriteLine("**********************************************************");
    }
    catch (Exception ex)
    {
        Console.WriteLine("**********************************************************");
        Console.WriteLine("❌ ERROR DE CONEXIÓN: " + ex.Message);
        Console.WriteLine("Asegúrate de que SQL Server esté corriendo.");
        Console.WriteLine("**********************************************************");
    }
}



// --- 3. CONFIGURACIÓN DEL PIPELINE (MIDDLEWARES) ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Esto permite que el navegador lea tus archivos HTML/CSS/JS

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();