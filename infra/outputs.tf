output "frontend_url" {
  description = "Public URL of the Azure Static Web App."
  value       = "https://${azurerm_static_web_app.main.default_host_name}"
}

output "swa_api_token" {
  description = "Deployment token for the Static Web App (used in GitHub Actions)."
  value       = azurerm_static_web_app.main.api_key
  sensitive   = true
}

output "resource_group" {
  description = "Name of the Azure resource group."
  value       = azurerm_resource_group.main.name
}
