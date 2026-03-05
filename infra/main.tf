resource "azurerm_resource_group" "main" {
  name     = "rg-${var.app_name}"
  location = var.location
}

resource "azurerm_static_web_app" "main" {
  name                = "${var.app_name}-swa"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  sku_tier            = var.swa_sku_tier
  sku_size            = var.swa_sku_size
}
