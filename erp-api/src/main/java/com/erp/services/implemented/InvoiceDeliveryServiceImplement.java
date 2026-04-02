package com.erp.services.implemented;

import com.erp.enities.CustomerPayment;
import com.erp.enities.SalesOrderHeader;
import com.erp.services.InvoiceDeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class InvoiceDeliveryServiceImplement implements InvoiceDeliveryService {

    private final JavaMailSender javaMailSender;
    @Override
    public void generateInvoice(SalesOrderHeader salesOrder) {
        log.info("Invoice generation placeholder for sale invoice: {}", salesOrder.getInvoiceNumber());
    }

    @Override
    public void printInvoice(SalesOrderHeader salesOrder) {
        log.info("Invoice print placeholder for sale invoice: {}", salesOrder.getInvoiceNumber());
    }

//    @Override
//    public void emailInvoice(SalesOrderHeader salesOrder) {
//        log.info("Invoice email placeholder for sale invoice: {}", salesOrder.getInvoiceNumber());
//    }

    @Override
    public void emailInvoice(String to, String subject, String body) {
        try{
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(body);
           javaMailSender.send(mail);
        }catch (Exception e){
            log.error("Exception while send email "+e);
        }
    }

    @Override
    public void notifySellerPaymentApproved(CustomerPayment payment) {
        // TODO:
        // 1. seller / receiver employee notification
        // 2. customer email / sms notification
        // 3. payment approval mail template
        log.info("Customer payment approved notification placeholder for voucher: {}", payment.getVoucherNo());
    }
}
