import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
 
// Import SVG files
import GooglePayIcon from '../assets/images/google-pay.svg';
import PhonePeIcon from '../assets/images/phone-pe.svg';
import PaytmIcon from '../assets/images/paytm.svg';
import AmazonPayIcon from '../assets/images/amazon-pay.svg';
import PayPalIcon from '../assets/images/paypal.svg';
 
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}
 
const paymentMethods = [
  { name: 'Paytm', icon: PaytmIcon },
  { name: 'Google Pay', icon: GooglePayIcon },
  { name: 'PhonePe', icon: PhonePeIcon },
  { name: 'Amazon Pay', icon: AmazonPayIcon },
  { name: 'PayPal', icon: PayPalIcon },
];
 
const PaymentModal: React.FC<ModalProps> = ({ isOpen, onClose, amount }) => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
 
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedPayment ? `Pay with ${selectedPayment}` : 'Select Payment Method'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>
 
          {/* Payment Selection Screen */}
          {!selectedPayment && (
            <>
              {/* UPI Payment Methods */}
              <View style={styles.paymentOptions}>
                {paymentMethods.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.iconButton} onPress={() => setSelectedPayment(item.name)}>
                    <item.icon width={50} height={50} />
                    <Text style={styles.iconLabel}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
 
              {/* Separator Line */}
              <View style={styles.separator} />
 
              {/* Other Payment Options */}
              <TouchableOpacity style={styles.paymentButton} onPress={() => setSelectedPayment('Credit Card')}>
                <Text style={styles.paymentButtonText}>Pay with Credit Card</Text>
              </TouchableOpacity>
 
              <TouchableOpacity style={styles.paymentButton} onPress={() => setSelectedPayment('NEFT')}>
                <Text style={styles.paymentButtonText}>Pay via NEFT</Text>
              </TouchableOpacity>
            </>
          )}
 
          {/* Credit Card Payment Form */}
          {selectedPayment === 'Credit Card' && (
            <>
              <Text style={styles.infoText}>Enter Credit Card Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                keyboardType="numeric"
                maxLength={16}
                value={cardNumber}
                onChangeText={setCardNumber}
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="MM/YY"
                  maxLength={5}
                  value={expiry}
                  onChangeText={setExpiry}
                />
                <TextInput
                  style={[styles.input, styles.smallInput]}
                  placeholder="CVV"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
              <TouchableOpacity style={styles.paymentButton}>
                <Text style={styles.paymentButtonText}>Proceed to Pay ₹{amount}</Text>
              </TouchableOpacity>
            </>
          )}
 
          {/* NEFT Payment Details */}
          {selectedPayment === 'NEFT' && (
            <>
              <Text style={styles.infoText}>Transfer the amount to the following bank details:</Text>
              <View style={styles.neftDetails}>
                <Text style={styles.boldText}>Bank Name:</Text>
                <Text>BGM Game Pvt.Ltd</Text>
                <Text style={styles.boldText}>Account Number:</Text>
                <Text>1234567890</Text>
                <Text style={styles.boldText}>IFSC Code:</Text>
                <Text>XYZB0001234</Text>
                <Text style={styles.boldText}>Account Holder:</Text>
                <Text>Manish Singh</Text>
              </View>
              <TouchableOpacity style={styles.paymentButton}>
                <Text style={styles.paymentButtonText}>I've Transferred ₹{amount}</Text>
              </TouchableOpacity>
            </>
          )}
 
          {/* Back Button */}
          {selectedPayment && (
            <TouchableOpacity style={styles.backButton} onPress={() => setSelectedPayment(null)}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};
 
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 320,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  iconButton: {
    alignItems: 'center',
    width: '30%',
    marginVertical: 10,
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 15,
  },
  paymentButton: {
    width: '90%',
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#007bff',
    alignItems: 'center',
    marginTop: 10,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  smallInput: {
    width: '45%',
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  neftDetails: {
    alignItems: 'center',
    marginBottom: 15,
  },
  boldText: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
 
export default PaymentModal;