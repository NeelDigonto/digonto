resource "aws_route53_record" "non-www" {
  zone_id = "Z0465132XMLPHCODCUN2"
  name    = "digonto.in"
  type    = "A"
  ttl     = 300
  records = [aws_eip.digonto-eip.public_ip]
}


resource "aws_route53_record" "www" {
  zone_id = "Z0465132XMLPHCODCUN2"
  name    = "www.digonto.in"
  type    = "A"
  ttl     = 300
  records = [aws_eip.digonto-eip.public_ip]
}

