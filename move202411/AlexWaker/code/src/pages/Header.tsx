import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { Box } from '@radix-ui/themes';
import { useState } from 'react';
import { useCurrentWallet } from '@mysten/dapp-kit';

const Header: React.FC = () => {
    const [showModal, setShowModal] = useState(false); // 控制弹窗显示状态
    const [summary, setSummary] = useState(''); // 摘要
    const [epoch, setEpoch] = useState(0); // Epoch
    const { currentWallet, connectionStatus } = useCurrentWallet();
    const [file, setFile] = useState<File | null>(null); // 上传的文件
    const isWalletConnected = () => {
        if (connectionStatus == 'disconnected') { //=赋值   ==相等   ===严格相等
            return false;
        }
        return true;
    };
    const isShowModal = () => {
        if (isWalletConnected()) {
            setShowModal(true);
        } else {
            alert('Please connect your wallet first');
        }
    }
    const handleSubmit = (summary:string,file:File|null,epoch:number) => {
        if(summary==''||file==null||epoch==0){
            
            console.log(summary,file,epoch);
            alert('Please fill in all fields');
            setShowModal(false);
        }else{
            alert('Submit Success!');
            setShowModal(false);
            return fetch(`https://publisher.walrus-testnet.walrus.space/v1/store?epochs=${epoch}`, {
                method: "PUT",
                body: file,
              }).then((response) => {
                if (response.status === 200) {
                  // Parse successful responses as JSON, and return it along with the
                  // mime type from the the file input element.
                  return response.json().then((info) => {
                    console.log(info);
                    alert(info);
                    setShowModal(false);
                    return { info: info, media_type: file.type };
                  });
                } else {
                  throw new Error("Something went wrong when storing the blob!");
                }
              })
            
        }
        
    };

    const handleCancel = () => {
        setShowModal(false);
    };
    
    return (
        <Box className="allHeader">
            <header className="header">
                <Box className="logo">LHFA</Box>
                <Box className="upload_buttons" style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => isShowModal()} // 点击按钮显示弹窗
                        style={{
                            padding: '10px 20px',
                            fontSize: '15px',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginRight: '20px',
                        }}
                    >
                        Upload your issue
                    </button>
                </Box>
                <Box className="connect_buttons">
                    <ConnectButton />
                </Box>
            </header>
            {/* 弹窗 */}
            {showModal && (
                <Box
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <Box
                        style={{
                            backgroundColor: 'black',
                            padding: '20px',
                            borderRadius: '10px',
                            width: '400px',
                            textAlign: 'center',
                        }}
                    >
                        <h2>数据输入</h2>
                        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>摘要</td>
                                    <td>
                                        <input
                                            placeholder="请输入摘要"
                                            id="summary"
                                            type="text"
                                            value={summary}
                                            onChange={(e) => setSummary(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '5px',
                                                border: '1px solid #ccc',
                                                borderRadius: '5px',
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>上传文件</td>
                                    <td>
                                        <input
                                            id="file"
                                            type="file"
                                            onChange={(e) => {
                                                const selectedFile = e.target.files?.[0];
                                                if (selectedFile) {
                                                    setFile(selectedFile);
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '10px', textAlign: 'left' }}>Epoch</td>
                                    <td>
                                        <input
                                            id="epoch"
                                            type="number"
                                            value={epoch}
                                            onChange={(e) => setEpoch(parseInt(e.target.value))} 
                                            /* 在React中，即使将input的type设置为number，onChange事件仍然会返回一个字符串类型的值 */
                                            style={{
                                                width: '100%',
                                                padding: '5px',
                                                border: '1px solid #ccc',
                                                borderRadius: '5px',
                                            }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Box style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                onClick={() => handleSubmit(summary, file, epoch)} // 提交表单
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '14px',
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Submit
                            </button>
                            <button
                                onClick={handleCancel} // 取消按钮
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '14px',
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default Header;
