using RealTimeDashboard.BackgroundJobs;
using RealTimeDashboard.Services;
using RealTimeDashboard.Hubs;
using RealTimeDashboard.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDistributedMemoryCache();

builder.Services.Configure<ChartUpdateSettings>(builder.Configuration.GetSection("ChartUpdateSettings"));
builder.Services.AddSingleton<ChartDataCache>();
builder.Services.AddSingleton<UserGroupTracker>();
builder.Services.AddScoped<IChartDataService,ChartDataService>();


builder.Services.AddHostedService<BarChartBackgroundService>();
builder.Services.AddHostedService<PieChartBackgroundService>();
builder.Services.AddHostedService<SalesChartBackgroundService>();




builder.Services.AddSignalR();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins("http://localhost:4200"); // or your frontend URL
    });
});

var app = builder.Build();

// Middleware pipeline
app.UseCors();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapHub<ChartHub>("/chartHub");

app.Run();
