import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, Image, StyleSheet } from 'react-native';
import { useDeposit, useGetDeposit, useGetWallet } from '../../hooks/api';
import { X } from 'lucide-react-native';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

const QRModal: React.FC<ModalProps> = ({ isOpen, onClose, amount }) => {
  const [utrNumber, setUtrNumber] = useState('');
  const depositMutation = useDeposit();
  const [userMobile, setUserMobile] = useState<string>('');

  useEffect(() => {
    const mobile = localStorage.getItem('mobile');
    if (mobile) setUserMobile(mobile);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = () => {
    depositMutation.mutate({ mobile: userMobile, amount, utr: utrNumber });
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add ₹{amount} Points</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <Image
              source={{ uri: 'https://bgmgamemedia.s3.amazonaws.com/qrcodes/2670180A_QRCode_3.pdf_and_3_more_pages_-_Personal_-_Microsoft_Edge_1_27_2025_6_10_21_PM.png' }}
              style={styles.qrImage}
            />
          </View>

          <Text style={styles.label}>Enter UTR Number</Text>
          <TextInput
            value={utrNumber}
            onChangeText={setUtrNumber}
            style={styles.input}
            placeholder="Enter UTR number"
            keyboardType="default"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Wallet = () => {
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [userMobile, setUserMobile] = useState<string>('');

  useEffect(() => {
    const mobile = localStorage.getItem('mobile');
    if (mobile) setUserMobile(mobile);
  }, []);

  const { data, isLoading } = useGetDeposit(userMobile);
  const { data: walletData } = useGetWallet(userMobile);
  const predefinedAmounts = [500, 1000, 1500, 2000, 2500, 3000];

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleAddPoints = () => {
    const numAmount = parseInt(amount);
    if (numAmount > 0) {
      setSelectedAmount(numAmount);
      setIsModalOpen(true);
    } else {
      alert('Please enter a valid amount');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.walletTitle}>Total Points: {walletData?.TotalAmount}</Text>
        <Text style={styles.addPointsTitle}>Add Points</Text>

        <TextInput
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
        />

        <View style={styles.amountGrid}>
          {predefinedAmounts.map((value) => (
            <TouchableOpacity key={value} style={styles.amountButton} onPress={() => handleAmountSelect(value)}>
              <Text style={styles.amountButtonText}>₹{value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddPoints}>
          <Text style={styles.addButtonText}>Add Points</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.historyTitle}>Wallet History</Text>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Sr No</Text>
            <Text style={styles.headerCell}>Type</Text>
            <Text style={styles.headerCell}>UTR</Text>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>Status</Text>
          </View>

          <FlatList
            data={data?.data}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={styles.tableCell}>Online</Text>
                <Text style={styles.tableCell}>{item.utr}</Text>
                <Text style={styles.tableCell}>{item.amount}</Text>
                <Text style={styles.tableCell}>{item.status}</Text>
              </View>
            )}
          />
        </View>
      </View>

      <QRModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} amount={selectedAmount} />
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#1E293B' },
  card: { backgroundColor: '#334155', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 3 },
  walletTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'white', textAlign: 'center' },
  addPointsTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10, color: 'white', textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#ddd' },
  amountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  amountButton: { backgroundColor: '#64748B', padding: 10, borderRadius: 8 },
  amountButtonText: { fontSize: 16, color: 'white' },
  addButton: { backgroundColor: '#22c55e', padding: 12, borderRadius: 8, marginTop: 20 },
  addButtonText: { textAlign: 'center', fontSize: 16, color: 'white', fontWeight: 'bold' },
  historyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10, color: 'white', textAlign: 'center' },
  tableContainer: { backgroundColor: '#475569', borderRadius: 8, padding: 10 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1E293B', padding: 10, borderRadius: 8 },
  headerCell: { flex: 1, textAlign: 'center', fontWeight: 'bold', color: 'white' },
  tableRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#64748B' },
  tableCell: { flex: 1, marginLeft : 5 , color: 'white' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '600' },
  qrContainer: { alignItems: 'center', marginBottom: 16 },
  qrImage: { width: 200, height: 200, resizeMode: 'contain' },
  submitButton: { backgroundColor: '#22c55e', padding: 12, borderRadius: 8, marginTop: 12 },
  submitButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});
