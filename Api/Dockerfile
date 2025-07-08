# Build .NET app
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY / ./
RUN dotnet restore
RUN dotnet publish RealTimeDashboard.csproj -c Release -o /out

# Final .NET Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:80
COPY --from=build /out ./
EXPOSE 80
ENTRYPOINT ["dotnet", "RealTimeDashboard.dll"]
