export async function faucet(address: string) {
  try {
    const response = await fetch('https://faucet.testnet.sui.io/gas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FixedAmountRequest: {
          recipient: address
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Faucet request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Faucet response:', data);
    return data;
  } catch (error) {
    console.error('Faucet error:', error);
    throw error;
  }
}
