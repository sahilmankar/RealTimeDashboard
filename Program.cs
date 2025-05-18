using RealTimeDashboard.BackgroundJobs;
using RealTimeDashboard.Services;
using RealTimeDashboard.Hubs;
using RealTimeDashboard.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.Configure<ChartUpdateSettings>(builder.Configuration.GetSection("ChartUpdateSettings"));
builder.Services.AddSingleton<ChartDataCache>();
builder.Services.AddSingleton<UserGroupTracker>();
builder.Services.AddScoped<IChartDataService,ChartDataService>();


builder.Services.AddHostedService<StockPriceChartService>();


builder.Services.AddSignalR();
builder.Services.AddControllers();

var app = builder.Build();

// Middleware pipeline
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapHub<ChartHub>("/chartHub");

app.Run();
