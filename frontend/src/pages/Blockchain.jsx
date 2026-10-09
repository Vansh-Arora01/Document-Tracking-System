// import {
//   Activity,
//   Blocks,
//   CheckCircle2,
//   CircleDot,
//   Database,
//   GitBranch,
//   Globe2,
//   Server,
//   ShieldCheck,
// } from 'lucide-react'

// import { useAuth } from '../context/AuthContext'

// function Blockchain() {
//   const { user } = useAuth()

//   const organization = user?.organization || '—'

//   const peer =
//     organization === 'Org2'
//       ? 'peer0.org2.example.com'
//       : 'peer0.org1.example.com'

//   const msp =
//     organization === 'Org2'
//       ? 'Org2MSP'
//       : 'Org1MSP'

//   return (
//     <div className="min-h-full bg-slate-950 text-white">
//       <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

//         {/* Header */}
//         <div>
//           <div className="mb-2 flex items-center gap-2 text-sm text-cyan-400">
//             <Blocks className="h-4 w-4" />
//             Hyperledger Fabric Network
//           </div>

//           <h1 className="text-3xl font-bold tracking-tight">
//             Blockchain
//           </h1>

//           <p className="mt-2 max-w-3xl text-slate-400">
//             Monitor the permissioned blockchain infrastructure used
//             to record and track document lifecycle operations.
//           </p>
//         </div>

//         {/* Network status */}
//         <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
//           <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

//             <div className="flex items-center gap-4">
//               <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
//                 <Activity className="h-6 w-6 text-emerald-400" />
//               </div>

//               <div>
//                 <p className="text-sm text-slate-400">
//                   Network Status
//                 </p>

//                 <div className="mt-1 flex items-center gap-2">
//                   <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

//                   <span className="text-xl font-semibold text-emerald-400">
//                     Connected
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm">
//               <span className="text-slate-500">
//                 Network
//               </span>

//               <span className="ml-2 font-medium text-slate-200">
//                 Hyperledger Fabric
//               </span>
//             </div>

//           </div>
//         </div>

//         {/* Network information */}
//         <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

//           <NetworkCard
//             icon={GitBranch}
//             label="Channel"
//             value="mychannel"
//             description="Fabric application channel"
//           />

//           <NetworkCard
//             icon={ShieldCheck}
//             label="Organization"
//             value={organization}
//             description="Current blockchain organization"
//           />

//           <NetworkCard
//             icon={Server}
//             label="Peer"
//             value={peer}
//             description="Organization peer"
//           />

//           <NetworkCard
//             icon={Database}
//             label="MSP"
//             value={msp}
//             description="Membership Service Provider"
//           />

//         </div>

//         {/* Architecture */}
//         <section>
//           <SectionHeading
//             icon={GitBranch}
//             title="Network Architecture"
//             description="Current permissioned blockchain topology"
//           />

//           <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

//             <div className="grid gap-4 lg:grid-cols-5 lg:items-center">

//               <ArchitectureNode
//                 icon={Globe2}
//                 title="Application"
//                 subtitle="Document Tracking System"
//               />

//               <Connector />

//               <ArchitectureNode
//                 icon={ShieldCheck}
//                 title={organization}
//                 subtitle={msp}
//                 active
//               />

//               <Connector />

//               <ArchitectureNode
//                 icon={Server}
//                 title={peer}
//                 subtitle="Fabric Peer"
//               />

//             </div>

//             <div className="my-6 h-px bg-slate-800" />

//             <div className="grid gap-4 md:grid-cols-2">

//               <ArchitectureNode
//                 icon={GitBranch}
//                 title="mychannel"
//                 subtitle="Shared Fabric channel"
//               />

//               <ArchitectureNode
//                 icon={Database}
//                 title="Document Ledger"
//                 subtitle="Blockchain state database"
//               />

//             </div>
//           </div>
//         </section>

//         {/* Fabric components */}
//         <section>
//           <SectionHeading
//             icon={Blocks}
//             title="Fabric Components"
//             description="Core components participating in document transactions"
//           />

//           <div className="mt-4 grid gap-4 md:grid-cols-3">

//             <ComponentCard
//               icon={Server}
//               title={peer}
//               type="Peer Node"
//               status="Operational"
//             />

//             <ComponentCard
//               icon={GitBranch}
//               title="mychannel"
//               type="Channel"
//               status="Active"
//             />

//             <ComponentCard
//               icon={Database}
//               title="DocumentTracking"
//               type="Smart Contract"
//               status="Deployed"
//             />

//           </div>
//         </section>

//         {/* Transaction model */}
//         <section>
//           <SectionHeading
//             icon={Activity}
//             title="Transaction Flow"
//             description="How document operations reach the blockchain"
//           />

//           <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

//             <div className="grid gap-3 md:grid-cols-5">

//               <FlowStep
//                 number="01"
//                 title="User"
//                 description="Authenticated application user"
//               />

//               <FlowStep
//                 number="02"
//                 title="Backend"
//                 description="JWT protected API"
//               />

//               <FlowStep
//                 number="03"
//                 title="Fabric Gateway"
//                 description="Blockchain connection"
//               />

//               <FlowStep
//                 number="04"
//                 title="Peer"
//                 description="Transaction endorsement"
//               />

//               <FlowStep
//                 number="05"
//                 title="Ledger"
//                 description="Committed blockchain state"
//               />

//             </div>
//           </div>
//         </section>

//         {/* Security */}
//         <section>
//           <div className="rounded-2xl border border-cyan-500/10 bg-gradient-to-r from-cyan-500/5 via-transparent to-violet-500/5 p-6">

//             <div className="flex gap-4">
//               <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
//                 <ShieldCheck className="h-6 w-6 text-cyan-400" />
//               </div>

//               <div>
//                 <h3 className="font-semibold text-slate-200">
//                   Permissioned Blockchain Security
//                 </h3>

//                 <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">
//                   Access to the document ledger is controlled through
//                   Hyperledger Fabric identities and organization membership.
//                   Application authentication is handled through JWT while
//                   blockchain transactions are submitted using Fabric
//                   organization identities.
//                 </p>
//               </div>
//             </div>

//           </div>
//         </section>

//       </div>
//     </div>
//   )
// }

// function NetworkCard({
//   icon: Icon,
//   label,
//   value,
//   description,
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10">
//       <div className="flex items-start justify-between gap-4">

//         <div className="min-w-0">
//           <p className="text-sm text-slate-500">
//             {label}
//           </p>

//           <p className="mt-2 truncate text-lg font-semibold text-slate-200">
//             {value}
//           </p>

//           <p className="mt-1 text-xs text-slate-600">
//             {description}
//           </p>
//         </div>

//         <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
//           <Icon className="h-5 w-5 text-cyan-400" />
//         </div>

//       </div>
//     </div>
//   )
// }

// function SectionHeading({
//   icon: Icon,
//   title,
//   description,
// }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="rounded-lg border border-slate-800 bg-slate-900 p-2">
//         <Icon className="h-5 w-5 text-cyan-400" />
//       </div>

//       <div>
//         <h2 className="font-semibold text-slate-200">
//           {title}
//         </h2>

//         <p className="mt-1 text-sm text-slate-500">
//           {description}
//         </p>
//       </div>
//     </div>
//   )
// }

// function ArchitectureNode({
//   icon: Icon,
//   title,
//   subtitle,
//   active = false,
// }) {
//   return (
//     <div
//       className={`rounded-xl border p-4 ${
//         active
//           ? 'border-cyan-500/30 bg-cyan-500/5'
//           : 'border-slate-800 bg-slate-950/50'
//       }`}
//     >
//       <div className="flex items-center gap-3">

//         <div className="rounded-lg border border-slate-700 bg-slate-900 p-2">
//           <Icon className="h-5 w-5 text-cyan-400" />
//         </div>

//         <div className="min-w-0">
//           <p className="truncate text-sm font-semibold text-slate-200">
//             {title}
//           </p>

//           <p className="truncate text-xs text-slate-500">
//             {subtitle}
//           </p>
//         </div>

//       </div>
//     </div>
//   )
// }

// function Connector() {
//   return (
//     <div className="hidden items-center justify-center lg:flex">
//       <div className="h-px w-full bg-slate-700" />
//       <CircleDot className="-ml-2 h-4 w-4 shrink-0 text-cyan-500" />
//     </div>
//   )
// }

// function ComponentCard({
//   icon: Icon,
//   title,
//   type,
//   status,
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

//       <div className="flex items-start justify-between">
//         <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
//           <Icon className="h-5 w-5 text-cyan-400" />
//         </div>

//         <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
//           {status}
//         </span>
//       </div>

//       <p className="mt-5 text-sm text-slate-500">
//         {type}
//       </p>

//       <h3 className="mt-1 truncate font-semibold text-slate-200">
//         {title}
//       </h3>

//     </div>
//   )
// }

// function FlowStep({
//   number,
//   title,
//   description,
// }) {
//   return (
//     <div className="relative rounded-xl border border-slate-800 bg-slate-950/50 p-4">

//       <span className="text-xs font-semibold text-cyan-400">
//         {number}
//       </span>

//       <h3 className="mt-3 text-sm font-semibold text-slate-200">
//         {title}
//       </h3>

//       <p className="mt-1 text-xs leading-5 text-slate-500">
//         {description}
//       </p>

//     </div>
//   )
// }

// export default Blockchain
import {
  Activity,
  Blocks,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock3,
  Database,
  GitBranch,
  Globe2,
  RefreshCw,
  Server,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { useAuth } from '../context/AuthContext'

import {
  getBlockchainStatus,
  getBlockchainActivity,
} from '../services/blockchainService'


function Blockchain() {

  const { user } = useAuth()

  const [networkStatus, setNetworkStatus] =
    useState(null)

  const [activity, setActivity] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState('')


  /*
   * ============================================================
   * LOAD BLOCKCHAIN DATA
   * ============================================================
   */

  const loadBlockchainData =
    useCallback(async (isRefresh = false) => {

      try {

        if (isRefresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        setError('')


        const [
          statusResponse,
          activityResponse,
        ] = await Promise.all([
          getBlockchainStatus(),
          getBlockchainActivity(),
        ])


        setNetworkStatus(
          statusResponse?.data || null
        )

        setActivity(
          activityResponse?.data || []
        )

      } catch (err) {

        console.error(
          'Blockchain dashboard error:',
          err
        )

        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Unable to connect to the blockchain backend.'
        )

      } finally {

        setLoading(false)
        setRefreshing(false)

      }

    }, [])


  /*
   * ============================================================
   * INITIAL LOAD
   * ============================================================
   */

  useEffect(() => {

    loadBlockchainData()

  }, [loadBlockchainData])


  /*
   * ============================================================
   * CURRENT ORGANIZATION
   * ============================================================
   */

  const currentOrganization =
    user?.organization || '—'


  /*
   * ============================================================
   * LOADING STATE
   * ============================================================
   */

  if (loading) {

    return (
      <div className="min-h-full bg-slate-950 text-white">

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <RefreshCw
              className="mx-auto h-7 w-7 animate-spin text-cyan-400"
            />

            <p className="mt-4 text-sm text-slate-400">
              Connecting to Hyperledger Fabric...
            </p>

            <p className="mt-2 text-xs text-slate-600">
              Checking peer connectivity and blockchain state
            </p>

          </div>

        </div>

      </div>
    )
  }


  /*
   * ============================================================
   * NETWORK STATUS
   * ============================================================
   */

  const network =
    networkStatus?.network

  const channel =
    networkStatus?.channel

  const chaincode =
    networkStatus?.chaincode

  const organizations =
    networkStatus?.organizations || []

  const orderingService =
    networkStatus?.orderingService

  const summary =
    networkStatus?.summary


  const connectedOrganizations =
    organizations.filter(
      org =>
        org.status === 'CONNECTED'
    ).length


  const networkOnline =
    network?.status === 'ONLINE'


  /*
   * ============================================================
   * CURRENT ORG DETAILS
   * ============================================================
   */

  const currentOrgDetails =
    organizations.find(
      org =>
        org.organization === currentOrganization
    )


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-full bg-slate-950 text-white">

      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">


        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2 text-sm text-cyan-400">

              <Blocks className="h-4 w-4" />

              Hyperledger Fabric Network

            </div>


            <h1 className="text-3xl font-bold tracking-tight">
              Blockchain
            </h1>


            <p className="mt-2 max-w-3xl text-slate-400">
              Monitor the permissioned blockchain infrastructure
              used to record and track document lifecycle operations.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              loadBlockchainData(true)
            }
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <RefreshCw
              className={
                refreshing
                  ? 'h-4 w-4 animate-spin'
                  : 'h-4 w-4'
              }
            />

            Refresh

          </button>

        </div>


        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

            <div className="flex items-start gap-3">

              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

              <div>

                <p className="text-sm font-semibold text-red-300">
                  Blockchain status could not be fully loaded
                </p>

                <p className="mt-1 text-xs leading-5 text-red-400/70">
                  {error}
                </p>

              </div>

            </div>

          </div>

        )}


        {/* ======================================================
            NETWORK STATUS
        ====================================================== */}

        <div
          className={[
            'rounded-2xl border p-6',
            networkOnline
              ? 'border-emerald-500/20 bg-emerald-500/5'
              : 'border-red-500/20 bg-red-500/5',
          ].join(' ')}
        >

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div
                className={[
                  'rounded-xl border p-3',
                  networkOnline
                    ? 'border-emerald-500/20 bg-emerald-500/10'
                    : 'border-red-500/20 bg-red-500/10',
                ].join(' ')}
              >

                {networkOnline ? (

                  <Activity className="h-6 w-6 text-emerald-400" />

                ) : (

                  <TriangleAlert className="h-6 w-6 text-red-400" />

                )}

              </div>


              <div>

                <p className="text-sm text-slate-400">
                  Network Status
                </p>


                <div className="mt-1 flex items-center gap-2">

                  <span
                    className={[
                      'h-2.5 w-2.5 rounded-full shadow-lg',
                      networkOnline
                        ? 'bg-emerald-400 shadow-emerald-400/50'
                        : 'bg-red-400 shadow-red-400/50',
                    ].join(' ')}
                  />


                  <span
                    className={[
                      'text-xl font-semibold',
                      networkOnline
                        ? 'text-emerald-400'
                        : 'text-red-400',
                    ].join(' ')}
                  >
                    {network?.status || 'UNKNOWN'}
                  </span>

                </div>


                <p className="mt-1 text-xs text-slate-600">

                  {connectedOrganizations}/
                  {organizations.length || 3}
                  {' '}organizations connected

                </p>

              </div>

            </div>


            <div className="flex flex-wrap gap-3">

              <StatusPill
                label="Channel"
                value={
                  channel?.name ||
                  'mychannel'
                }
                active={
                  channel?.status === 'ACTIVE'
                }
              />


              <StatusPill
                label="Chaincode"
                value={
                  chaincode
                    ? `${chaincode.name} v${chaincode.version}`
                    : 'documentcc v1.1'
                }
                active={
                  chaincode?.status === 'ACTIVE'
                }
              />


              <StatusPill
                label="Consensus"
                value={
                  orderingService?.type ||
                  'Raft'
                }
                active
              />

            </div>

          </div>

        </div>


        {/* ======================================================
            NETWORK INFORMATION
        ====================================================== */}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <NetworkCard
            icon={GitBranch}
            label="Channel"
            value={
              channel?.name ||
              'mychannel'
            }
            description="Fabric application channel"
          />


          <NetworkCard
            icon={ShieldCheck}
            label="Organization"
            value={currentOrganization}
            description={
              currentOrgDetails?.mspId
                ? currentOrgDetails.mspId
                : 'Current blockchain organization'
            }
          />


          <NetworkCard
            icon={Server}
            label="Peer"
            value={
              currentOrgDetails?.peer ||
              '—'
            }
            description={
              currentOrgDetails?.status === 'CONNECTED'
                ? 'Live Fabric peer connection'
                : 'Peer connection status unavailable'
            }
          />


          <NetworkCard
            icon={Database}
            label="Chaincode"
            value={
              chaincode
                ? `${chaincode.name} v${chaincode.version}`
                : 'documentcc v1.1'
            }
            description="Deployed document smart contract"
          />

        </div>


        {/* ======================================================
            ORGANIZATIONS
        ====================================================== */}

        <section>

          <SectionHeading
            icon={ShieldCheck}
            title="Fabric Organizations"
            description="Live connectivity status of participating peer organizations"
          />


          <div className="mt-4 grid gap-4 md:grid-cols-3">

            {organizations.length > 0 ? (

              organizations.map(
                organization => (

                  <OrganizationCard
                    key={
                      organization.organization
                    }
                    organization={
                      organization
                    }
                  />

                )
              )

            ) : (

              <>
                <OrganizationCard
                  organization={{
                    organization: 'Org1',
                    mspId: 'Org1MSP',
                    peer: 'peer0.org1.example.com',
                    status: 'UNKNOWN',
                  }}
                />

                <OrganizationCard
                  organization={{
                    organization: 'Org2',
                    mspId: 'Org2MSP',
                    peer: 'peer0.org2.example.com',
                    status: 'UNKNOWN',
                  }}
                />

                <OrganizationCard
                  organization={{
                    organization: 'Org3',
                    mspId: 'Org3MSP',
                    peer: 'peer0.org3.example.com',
                    status: 'UNKNOWN',
                  }}
                />
              </>

            )}

          </div>

        </section>


        {/* ======================================================
            ORDERING SERVICE
        ====================================================== */}

        <section>

          <SectionHeading
            icon={Blocks}
            title="Ordering Service"
            description="Three-node Raft ordering service used by the Fabric network"
          />


          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Consensus Mechanism
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-200">
                  {orderingService?.type || 'Raft'}
                </p>

              </div>


              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-2">

                <p className="text-xs text-cyan-400">
                  {summary?.totalOrderers || 3}
                  {' '}Orderers Configured
                </p>

              </div>

            </div>


            <div className="grid gap-4 md:grid-cols-3">

              {(
                orderingService?.nodes ||
                [
                  {
                    name:
                      'orderer1.org1.example.com',
                    endpoint:
                      'localhost:7050',
                  },
                  {
                    name:
                      'orderer2.org2.example.com',
                    endpoint:
                      'localhost:8050',
                  },
                  {
                    name:
                      'orderer3.org3.example.com',
                    endpoint:
                      'localhost:9050',
                  },
                ]
              ).map(
                orderer => (

                  <OrdererCard
                    key={orderer.name}
                    orderer={orderer}
                  />

                )
              )}

            </div>


            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/50 p-4">

              <div className="flex items-start gap-3">

                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

                <div>

                  <p className="text-sm font-medium text-slate-300">
                    Raft ordering service
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    The network is configured with three ordering
                    nodes using the Raft consensus mechanism.
                    Individual leader status is only shown when
                    verified from the ordering service.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ======================================================
            NETWORK ARCHITECTURE
        ====================================================== */}

        <section>

          <SectionHeading
            icon={GitBranch}
            title="Network Architecture"
            description="Current permissioned blockchain topology"
          />


          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="grid gap-4 lg:grid-cols-5 lg:items-center">

              <ArchitectureNode
                icon={Globe2}
                title="Application"
                subtitle="Document Tracking System"
              />


              <Connector />


              <ArchitectureNode
                icon={ShieldCheck}
                title={currentOrganization}
                subtitle={
                  currentOrgDetails?.mspId ||
                  'Fabric MSP'
                }
                active
              />


              <Connector />


              <ArchitectureNode
                icon={Server}
                title={
                  currentOrgDetails?.peer ||
                  'Fabric Peer'
                }
                subtitle="Fabric Peer"
              />

            </div>


            <div className="my-6 h-px bg-slate-800" />


            <div className="grid gap-4 md:grid-cols-3">

              <ArchitectureNode
                icon={GitBranch}
                title={
                  channel?.name ||
                  'mychannel'
                }
                subtitle="Shared Fabric channel"
              />


              <ArchitectureNode
                icon={Blocks}
                title="Raft"
                subtitle="Distributed ordering service"
              />


              <ArchitectureNode
                icon={Database}
                title="Document Ledger"
                subtitle="Blockchain state database"
              />

            </div>

          </div>

        </section>


        {/* ======================================================
            FABRIC COMPONENTS
        ====================================================== */}

        <section>

          <SectionHeading
            icon={Blocks}
            title="Fabric Components"
            description="Core components participating in document transactions"
          />


          <div className="mt-4 grid gap-4 md:grid-cols-3">

            {organizations.map(
              organization => (

                <ComponentCard
                  key={
                    organization.organization
                  }
                  icon={Server}
                  title={
                    organization.peer
                  }
                  type={`${organization.organization} Peer Node`}
                  status={
                    organization.status
                  }
                  live={
                    organization.status ===
                    'CONNECTED'
                  }
                />

              )
            )}


            <ComponentCard
              icon={GitBranch}
              title={
                channel?.name ||
                'mychannel'
              }
              type="Fabric Channel"
              status={
                channel?.status ||
                'UNKNOWN'
              }
              live={
                channel?.status ===
                'ACTIVE'
              }
            />


            <ComponentCard
              icon={Database}
              title={
                chaincode
                  ? chaincode.name
                  : 'documentcc'
              }
              type="Smart Contract"
              status={
                chaincode?.status ||
                'UNKNOWN'
              }
              live={
                chaincode?.status ===
                'ACTIVE'
              }
            />


            <ComponentCard
              icon={Blocks}
              title="Raft Ordering Service"
              type="Ordering Service"
              status={
                orderingService
                  ? 'Configured'
                  : 'UNKNOWN'
              }
              live={
                Boolean(
                  orderingService
                )
              }
            />

          </div>

        </section>


        {/* ======================================================
            RECENT BLOCKCHAIN ACTIVITY
        ====================================================== */}

        <section>

          <SectionHeading
            icon={Activity}
            title="Recent Blockchain Activity"
            description="Transactions recovered from the actual Fabric ledger history"
          />


          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">

            {activity.length === 0 ? (

              <div className="p-10 text-center">

                <Blocks className="mx-auto h-8 w-8 text-slate-700" />

                <p className="mt-4 text-sm text-slate-500">
                  No blockchain transaction history found.
                </p>

                <p className="mt-1 text-xs text-slate-700">
                  Create or modify a document to generate
                  blockchain activity.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-slate-800">

                {activity
                  .slice(0, 20)
                  .map(
                    (transaction, index) => (

                      <TransactionRow
                        key={
                          transaction.transactionId ||
                          `${transaction.documentId}-${index}`
                        }
                        transaction={
                          transaction
                        }
                      />

                    )
                  )}

              </div>

            )}

          </div>

        </section>


        {/* ======================================================
            TRANSACTION FLOW
        ====================================================== */}

        <section>

          <SectionHeading
            icon={Activity}
            title="Transaction Flow"
            description="How document operations reach the blockchain"
          />


          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

            <div className="grid gap-3 md:grid-cols-5">

              <FlowStep
                number="01"
                title="User"
                description="Authenticated application user"
              />


              <FlowStep
                number="02"
                title="Backend"
                description="JWT protected API"
              />


              <FlowStep
                number="03"
                title="Fabric Gateway"
                description="Blockchain connection"
              />


              <FlowStep
                number="04"
                title="Peer"
                description="Transaction proposal and endorsement"
              />


              <FlowStep
                number="05"
                title="Ledger"
                description="Ordered and committed blockchain state"
              />

            </div>


            <div className="mt-5 grid gap-3 md:grid-cols-4">

              <LifecycleStep
                number="A"
                title="Proposal"
                description="Application submits transaction"
              />

              <LifecycleStep
                number="B"
                title="Endorsement"
                description="Required peers validate proposal"
              />

              <LifecycleStep
                number="C"
                title="Ordering"
                description="Raft ordering service orders transaction"
              />

              <LifecycleStep
                number="D"
                title="Commit"
                description="Peers commit the resulting block"
              />

            </div>

          </div>

        </section>


        {/* ======================================================
            SECURITY
        ====================================================== */}

        <section>

          <div className="rounded-2xl border border-cyan-500/10 bg-gradient-to-r from-cyan-500/5 via-transparent to-violet-500/5 p-6">

            <div className="flex gap-4">

              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">

                <ShieldCheck className="h-6 w-6 text-cyan-400" />

              </div>


              <div>

                <h3 className="font-semibold text-slate-200">
                  Permissioned Blockchain Security
                </h3>


                <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">

                  Access to the document ledger is controlled
                  through Hyperledger Fabric identities and
                  organization membership. Application authentication
                  is handled through JWT while blockchain transactions
                  are submitted using Fabric organization identities.

                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ======================================================
            FOOTER
        ====================================================== */}

        <div className="flex flex-col gap-2 border-t border-slate-900 pt-4 text-[10px] text-slate-700 sm:flex-row sm:items-center sm:justify-between">

          <span>
            Last checked:{' '}
            {networkStatus?.checkedAt
              ? new Date(
                  networkStatus.checkedAt
                ).toLocaleString()
              : '—'}
          </span>


          <span className="flex items-center gap-1.5">

            <ShieldCheck className="h-3 w-3" />

            Blockchain information queried from Fabric

          </span>

        </div>

      </div>

    </div>
  )
}


/* ============================================================
   NETWORK CARD
   ============================================================ */

function NetworkCard({
  icon: Icon,
  label,
  value,
  description,
}) {

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="text-sm text-slate-500">
            {label}
          </p>


          <p className="mt-2 truncate text-lg font-semibold text-slate-200">
            {value}
          </p>


          <p className="mt-1 text-xs text-slate-600">
            {description}
          </p>

        </div>


        <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">

          <Icon className="h-5 w-5 text-cyan-400" />

        </div>

      </div>

    </div>
  )
}


/* ============================================================
   STATUS PILL
   ============================================================ */

function StatusPill({
  label,
  value,
  active = false,
}) {

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2">

      <p className="text-[9px] uppercase tracking-wider text-slate-600">
        {label}
      </p>


      <div className="mt-1 flex items-center gap-2">

        <span
          className={[
            'h-1.5 w-1.5 rounded-full',
            active
              ? 'bg-emerald-400'
              : 'bg-slate-600',
          ].join(' ')}
        />


        <span className="text-xs font-medium text-slate-300">
          {value}
        </span>

      </div>

    </div>
  )
}


/* ============================================================
   SECTION HEADING
   ============================================================ */

function SectionHeading({
  icon: Icon,
  title,
  description,
}) {

  return (
    <div className="flex items-start gap-3">

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-2">

        <Icon className="h-5 w-5 text-cyan-400" />

      </div>


      <div>

        <h2 className="font-semibold text-slate-200">
          {title}
        </h2>


        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

    </div>
  )
}


/* ============================================================
   ORGANIZATION CARD
   ============================================================ */

function OrganizationCard({
  organization,
}) {

  const connected =
    organization.status ===
    'CONNECTED'


  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">

          <p className="text-sm font-semibold text-slate-200">
            {organization.organization}
          </p>


          <p className="mt-1 font-mono text-xs text-slate-600">
            {organization.mspId}
          </p>

        </div>


        <span
          className={[
            'flex shrink-0 items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider',
            connected
              ? 'text-emerald-400'
              : organization.status === 'OFFLINE'
                ? 'text-red-400'
                : 'text-slate-500',
          ].join(' ')}
        >

          {connected ? (

            <CheckCircle2 className="h-3.5 w-3.5" />

          ) : organization.status === 'OFFLINE' ? (

            <TriangleAlert className="h-3.5 w-3.5" />

          ) : (

            <Circle className="h-3 w-3" />

          )}

          {organization.status || 'UNKNOWN'}

        </span>

      </div>


      <div className="mt-5 space-y-3">

        <div>

          <p className="text-[9px] uppercase tracking-wider text-slate-600">
            Peer
          </p>

          <p className="mt-1 truncate font-mono text-xs text-slate-400">
            {organization.peer || '—'}
          </p>

        </div>


        <div>

          <p className="text-[9px] uppercase tracking-wider text-slate-600">
            Endpoint
          </p>

          <p className="mt-1 font-mono text-xs text-slate-500">
            {organization.endpoint || '—'}
          </p>

        </div>

      </div>

    </div>
  )
}


/* ============================================================
   ORDERER CARD
   ============================================================ */

function OrdererCard({
  orderer,
}) {

  const verified =
    orderer.status ===
    'CONNECTED'


  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-2">

            <Blocks className="h-4 w-4 text-cyan-400" />

          </div>


          <div className="min-w-0">

            <p className="truncate text-xs font-semibold text-slate-300">
              {orderer.name}
            </p>


            <p className="mt-1 font-mono text-[9px] text-slate-600">
              {orderer.endpoint}
            </p>

          </div>

        </div>


        <span
          className={[
            'shrink-0 text-[8px] font-semibold uppercase tracking-wider',
            verified
              ? 'text-emerald-400'
              : 'text-slate-600',
          ].join(' ')}
        >

          {orderer.status || 'CONFIGURED'}

        </span>

      </div>

    </div>
  )
}


/* ============================================================
   ARCHITECTURE NODE
   ============================================================ */

function ArchitectureNode({
  icon: Icon,
  title,
  subtitle,
  active = false,
}) {

  return (
    <div
      className={[
        'rounded-xl border p-4',
        active
          ? 'border-cyan-500/30 bg-cyan-500/5'
          : 'border-slate-800 bg-slate-950/50',
      ].join(' ')}
    >

      <div className="flex items-center gap-3">

        <div className="rounded-lg border border-slate-700 bg-slate-900 p-2">

          <Icon className="h-5 w-5 text-cyan-400" />

        </div>


        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-slate-200">
            {title}
          </p>


          <p className="truncate text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

      </div>

    </div>
  )
}


/* ============================================================
   CONNECTOR
   ============================================================ */

function Connector() {

  return (
    <div className="hidden items-center justify-center lg:flex">

      <div className="h-px w-full bg-slate-700" />

      <CircleDot className="-ml-2 h-4 w-4 shrink-0 text-cyan-500" />

    </div>
  )
}


/* ============================================================
   COMPONENT CARD
   ============================================================ */

function ComponentCard({
  icon: Icon,
  title,
  type,
  status,
  live = false,
}) {

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

      <div className="flex items-start justify-between gap-3">

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">

          <Icon className="h-5 w-5 text-cyan-400" />

        </div>


        <span
          className={[
            'rounded-full border px-3 py-1 text-xs',
            live
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : status === 'OFFLINE'
                ? 'border-red-500/20 bg-red-500/10 text-red-400'
                : 'border-slate-700 bg-slate-800 text-slate-500',
          ].join(' ')}
        >
          {status || 'UNKNOWN'}
        </span>

      </div>


      <p className="mt-5 text-sm text-slate-500">
        {type}
      </p>


      <h3 className="mt-1 truncate font-semibold text-slate-200">
        {title}
      </h3>

    </div>
  )
}


/* ============================================================
   TRANSACTION ROW
   ============================================================ */

function TransactionRow({
  transaction,
}) {

  return (
    <div className="p-5 transition hover:bg-slate-950/50">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        <div className="flex min-w-0 gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5">

            <CheckCircle2 className="h-5 w-5 text-emerald-400" />

          </div>


          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <p className="text-sm font-semibold text-slate-200">
                {transaction.operation ||
                  'Blockchain Transaction'}
              </p>


              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider text-emerald-400">
                Recorded
              </span>

            </div>


            <p className="mt-1 text-xs text-slate-500">

              Document:{' '}

              <span className="font-medium text-slate-400">
                {transaction.documentId || '—'}
              </span>

              {transaction.title && (
                <>
                  {' '}·{' '}
                  {transaction.title}
                </>
              )}

            </p>


            <div className="mt-3 flex flex-wrap gap-2">

              <MetadataBadge
                label="Organization"
                value={
                  transaction.organization
                }
              />


              <MetadataBadge
                label="MSP"
                value={
                  transaction.mspId
                }
              />


              <MetadataBadge
                label="Channel"
                value={
                  transaction.channel
                }
              />


              <MetadataBadge
                label="Chaincode"
                value={
                  transaction.chaincode
                }
              />

            </div>

          </div>

        </div>


        <div className="min-w-0 lg:w-80">

          <div className="flex items-center gap-2">

            <Blocks className="h-3.5 w-3.5 shrink-0 text-cyan-500" />

            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              Fabric Transaction ID
            </p>

          </div>


          <p className="mt-2 break-all rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-[9px] leading-5 text-cyan-400/80">

            {transaction.transactionId ||
              'Transaction ID unavailable'}

          </p>


          <div className="mt-2 flex items-center gap-1.5 text-[9px] text-slate-600">

            <Clock3 className="h-3 w-3" />

            {transaction.timestamp
              ? new Date(
                  transaction.timestamp
                ).toLocaleString()
              : 'Timestamp unavailable'}

          </div>

        </div>

      </div>

    </div>
  )
}


/* ============================================================
   METADATA BADGE
   ============================================================ */

function MetadataBadge({
  label,
  value,
}) {

  return (
    <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-[8px] text-slate-500">

      <span className="text-slate-700">
        {label}:
      </span>

      {' '}

      {value || '—'}

    </span>
  )
}


/* ============================================================
   FLOW STEP
   ============================================================ */

function FlowStep({
  number,
  title,
  description,
}) {

  return (
    <div className="relative rounded-xl border border-slate-800 bg-slate-950/50 p-4">

      <span className="text-xs font-semibold text-cyan-400">
        {number}
      </span>


      <h3 className="mt-3 text-sm font-semibold text-slate-200">
        {title}
      </h3>


      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}


/* ============================================================
   LIFECYCLE STEP
   ============================================================ */

function LifecycleStep({
  number,
  title,
  description,
}) {

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">

      <div className="flex items-center gap-2">

        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-[9px] font-bold text-cyan-400">

          {number}

        </span>


        <p className="text-xs font-semibold text-slate-300">
          {title}
        </p>

      </div>


      <p className="mt-2 text-[10px] leading-5 text-slate-600">
        {description}
      </p>

    </div>
  )
}


export default Blockchain