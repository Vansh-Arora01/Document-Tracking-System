import api from './api'


/*
 * ============================================================
 * NETWORK STATUS
 * ============================================================
 */

export async function getBlockchainStatus() {

  const response =
    await api.get('/blockchain/status')

  return response.data
}


/*
 * ============================================================
 * BLOCKCHAIN ACTIVITY
 * ============================================================
 */

export async function getBlockchainActivity() {

  const response =
    await api.get('/blockchain/activity')

  return response.data
}


/*
 * ============================================================
 * SINGLE TRANSACTION
 * ============================================================
 */

export async function getBlockchainTransaction(txId) {

  const response =
    await api.get(
      `/blockchain/transaction/${txId}`
    )

  return response.data
}