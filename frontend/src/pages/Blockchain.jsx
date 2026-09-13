import {
  Activity,
  Blocks,
  CheckCircle2,
  CircleDot,
  Database,
  GitBranch,
  Globe2,
  Server,
  ShieldCheck,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

function Blockchain() {
  const { user } = useAuth()

  const organization = user?.organization || '—'

  const peer =
    organization === 'Org2'
      ? 'peer0.org2.example.com'
      : 'peer0.org1.example.com'

  const msp =
    organization === 'Org2'
      ? 'Org2MSP'
      : 'Org1MSP'

  return (
    <div className="min-h-full bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

        {/* Header */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-cyan-400">
            <Blocks className="h-4 w-4" />
            Hyperledger Fabric Network
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Blockchain
          </h1>

          <p className="mt-2 max-w-3xl text-slate-400">
            Monitor the permissioned blockchain infrastructure used
            to record and track document lifecycle operations.
          </p>
        </div>

        {/* Network status */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <Activity className="h-6 w-6 text-emerald-400" />
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Network Status
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

                  <span className="text-xl font-semibold text-emerald-400">
                    Connected
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm">
              <span className="text-slate-500">
                Network
              </span>

              <span className="ml-2 font-medium text-slate-200">
                Hyperledger Fabric
              </span>
            </div>

          </div>
        </div>

        {/* Network information */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <NetworkCard
            icon={GitBranch}
            label="Channel"
            value="mychannel"
            description="Fabric application channel"
          />

          <NetworkCard
            icon={ShieldCheck}
            label="Organization"
            value={organization}
            description="Current blockchain organization"
          />

          <NetworkCard
            icon={Server}
            label="Peer"
            value={peer}
            description="Organization peer"
          />

          <NetworkCard
            icon={Database}
            label="MSP"
            value={msp}
            description="Membership Service Provider"
          />

        </div>

        {/* Architecture */}
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
                title={organization}
                subtitle={msp}
                active
              />

              <Connector />

              <ArchitectureNode
                icon={Server}
                title={peer}
                subtitle="Fabric Peer"
              />

            </div>

            <div className="my-6 h-px bg-slate-800" />

            <div className="grid gap-4 md:grid-cols-2">

              <ArchitectureNode
                icon={GitBranch}
                title="mychannel"
                subtitle="Shared Fabric channel"
              />

              <ArchitectureNode
                icon={Database}
                title="Document Ledger"
                subtitle="Blockchain state database"
              />

            </div>
          </div>
        </section>

        {/* Fabric components */}
        <section>
          <SectionHeading
            icon={Blocks}
            title="Fabric Components"
            description="Core components participating in document transactions"
          />

          <div className="mt-4 grid gap-4 md:grid-cols-3">

            <ComponentCard
              icon={Server}
              title={peer}
              type="Peer Node"
              status="Operational"
            />

            <ComponentCard
              icon={GitBranch}
              title="mychannel"
              type="Channel"
              status="Active"
            />

            <ComponentCard
              icon={Database}
              title="DocumentTracking"
              type="Smart Contract"
              status="Deployed"
            />

          </div>
        </section>

        {/* Transaction model */}
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
                description="Transaction endorsement"
              />

              <FlowStep
                number="05"
                title="Ledger"
                description="Committed blockchain state"
              />

            </div>
          </div>
        </section>

        {/* Security */}
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
                  Access to the document ledger is controlled through
                  Hyperledger Fabric identities and organization membership.
                  Application authentication is handled through JWT while
                  blockchain transactions are submitted using Fabric
                  organization identities.
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}

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

function ArchitectureNode({
  icon: Icon,
  title,
  subtitle,
  active = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        active
          ? 'border-cyan-500/30 bg-cyan-500/5'
          : 'border-slate-800 bg-slate-950/50'
      }`}
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

function Connector() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <div className="h-px w-full bg-slate-700" />
      <CircleDot className="-ml-2 h-4 w-4 shrink-0 text-cyan-500" />
    </div>
  )
}

function ComponentCard({
  icon: Icon,
  title,
  type,
  status,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">

      <div className="flex items-start justify-between">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-3">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>

        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
          {status}
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

export default Blockchain