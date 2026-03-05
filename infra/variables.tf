variable "app_name" {
  description = "Application name in kebab-case (e.g. my-app). Used to name Azure resources."
  type        = string
}

variable "location" {
  description = "Azure region for the resource group and Static Web App."
  type        = string
  default     = "westeurope"
}

variable "swa_sku_tier" {
  description = "Static Web App SKU tier."
  type        = string
  default     = "Free"
}

variable "swa_sku_size" {
  description = "Static Web App SKU size (must match the tier)."
  type        = string
  default     = "Free"
}
