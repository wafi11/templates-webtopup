INSERT INTO payment_methods (
    name,
    code,
    calculation_type,
    description,
    image,
    margin_amount,
    margin_percentage
) VALUES
('BCA Virtual Account', 'BCA_VA', 'HYBRID', 'Dicek Otomatis', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png', 1000, 0.7),
('Mandiri Virtual Account', 'MANDIRI_VA', 'HYBRID', 'Dicek Otomatis', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png', 1000, 0.7),
('BNI Virtual Account', 'BNI_VA', 'HYBRID', 'Dicek Otomatis', 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/2560px-BNI_logo.svg.png', 1000, 0.7),
('BRI Virtual Account', 'BRI_VA', 'HYBRID', 'Dicek Otomatis', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_2020.svg/2560px-BRI_2020.svg.png', 1000, 0.7),
('Permata Virtual Account', 'PERMATA_VA', 'HYBRID', 'Dicek Otomatis', 'https://upload.wikimedia.org/wikipedia/id/thumb/9/97/Bank_Permata.svg/2560px-Bank_Permata.svg.png', 1000, 0.7),
('GoPay', 'GOPAY', 'PERCENTAGE', 'Pembayaran via GoPay', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png', 0, 2),
('OVO', 'OVO', 'PERCENTAGE', 'Pembayaran via OVO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png', 0, 2),
('DANA', 'DANA', 'PERCENTAGE', 'Pembayaran via DANA', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png', 0, 2),
('ShopeePay', 'SHOPEEPAY', 'PERCENTAGE', 'Pembayaran via ShopeePay', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/2560px-Shopee.svg.png', 0, 2),
('LinkAja', 'LINKAJA', 'PERCENTAGE', 'Pembayaran via LinkAja', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/LinkAja.svg/2560px-LinkAja.svg.png', 0, 2),
('Credit Card', 'CC', 'PERCENTAGE', 'Visa/Mastercard/JCB', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png', 0, 2.9),
('Indomaret', 'INDOMARET', 'AMOUNT', 'Bayar di Indomaret', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Logo_Indomaret.png/2560px-Logo_Indomaret.png', 2500, 0),
('Alfamart', 'ALFAMART', 'AMOUNT', 'Bayar di Alfamart', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Alfamart_logo.svg/2560px-Alfamart_logo.svg.png', 2500, 0),
('QRIS', 'QRIS', 'PERCENTAGE', 'Scan QRIS', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/QRIS_logo.svg/2560px-QRIS_logo.svg.png', 0, 0.7);