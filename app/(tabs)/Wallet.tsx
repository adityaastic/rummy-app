import React, { useState } from 'react';
import { QrCode, X } from 'lucide-react-native';
import { useDeposit, useGetDeposit } from "../../hooks/api";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

const QRModal: React.FC<ModalProps> = ({ isOpen, onClose, amount }) => {
  const [utrNumber, setUtrNumber] = useState('');
  const depositMutation = useDeposit();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    depositMutation.mutate(
      {
        mobile: '6203528288', // Fixed mobile number
        amount,
        utr: utrNumber,
      })
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxWidth: 400
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: '600',
            margin: 0
          }}>Add ₹{amount} Points</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: 8,
              cursor: 'pointer'
            }}
          >
            <X size={24} style={{ color: '#666' }} />
          </button>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 24
        }}>
          {/* <QrCode size={200} style={{ color: '#333' }} /> */}

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 24
          }}>
            <img
              src="https://bgmgamemedia.s3.amazonaws.com/qrcodes/2670180A_QRCode_3.pdf_and_3_more_pages_-_Personal_-_Microsoft_Edge_1_27_2025_6_10_21_PM.png"
              alt="QR Code"
              style={{ width: 200, height: 200, objectFit: 'cover' }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: '500',
              marginBottom: 4,
              color: '#333'
            }}>
              Enter UTR Number
            </label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 16,
                border: '1px solid #ddd',
                borderRadius: 8,
                outline: 'none'
              }}
              placeholder="Enter UTR number"
              required
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#22c55e',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

function Wallet() {
  const [amount, setAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const { data, isLoading, error } = useGetDeposit('6203528288');


  const predefinedAmounts = [500, 1000, 1500, 2000, 2500, 3000];

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleAddPoints = () => {
    const numAmount = parseInt(amount);
    if (numAmount > 0) {
      setSelectedAmount(numAmount);
      setIsModalOpen(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: 16
    }}>
      <div style={{
        maxWidth: 480,
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 24,
          color: '#333'
        }}>Add Point</h1>
        <div style={{ marginBottom: 24 }}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 16,
              border: '1px solid #ddd',
              borderRadius: 8,
              outline: 'none'
            }}
            placeholder="Enter amount"
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 24
        }}>
          {predefinedAmounts.map((value) => (
            <button
              key={value}
              onClick={() => handleAmountSelect(value)}
              style={{
                padding: '8px',
                backgroundColor: '#f5f5f5',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16
              }}
            >
              ₹{value}
            </button>
          ))}
        </div>

        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: 16
        }}>
          आपका पैसा 5 से 10 मिनट में पड़ जाएगा
        </p>

        <button
          onClick={handleAddPoints}
          style={{
            width: '100%',
            backgroundColor: '#22c55e',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: 32
          }}
        >
          Add Points
        </button>

        <div>
          <h2 style={{
            fontSize: 20,
            fontWeight: '600',
            marginBottom: 16,
            color: '#333'
          }}>Wallet History</h2>
          <div style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            overflow: 'hidden'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead style={{ backgroundColor: '#f5f5f5' }}>
                <tr>
                  <th style={{
                    padding: '5px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd'
                  }}>S. No.</th>
                  <th style={{
                    padding: '5px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd'
                  }}>Pay Mode</th>
                  <th style={{
                    padding: '5px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd'
                  }}>Transaction Id</th>
                  <th style={{
                    padding: '5px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd'
                  }}>Amount</th>
                  <th style={{
                    padding: '5px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd'
                  }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((deposit: any, index: number) => (
                  <tr key={deposit._id}>
                    <td style={{ padding: '5px' }}>{index + 1}</td>
                    <td style={{ padding: '5px' }}>Online</td>
                    <td style={{ padding: '5px' }}>{deposit.utr}</td>
                    <td style={{ padding: '5px' }}>{deposit.amount}</td>
                    <td style={{ padding: '5px' }}>{deposit.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <QRModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={selectedAmount}
      />
    </div>
  );
}

export default Wallet;