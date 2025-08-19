variable "zone_name" {
  type    = string
  default = "veganmapai.ai"
}

variable "auth_target" {
  type    = string
  default = "hostingveganmapai.web.app"
}

data "cloudflare_zones" "z" {
  filter {
    name = var.zone_name
  }
}

locals {
  zone_id = data.cloudflare_zones.z.zones[0].id
}

# CNAME auth -> Firebase Hosting
resource "cloudflare_record" "auth" {
  zone_id = local.zone_id
  name    = "auth"
  type    = "CNAME"
  value   = var.auth_target
  proxied = false
  ttl     = 300
}

# (по избор) www -> apex
resource "cloudflare_record" "www" {
  zone_id = local.zone_id
  name    = "www"
  type    = "CNAME"
  value   = var.zone_name
  proxied = false
  ttl     = 300
}
