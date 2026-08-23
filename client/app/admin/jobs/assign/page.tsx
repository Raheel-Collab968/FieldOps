import AssignTable from './AssignTable';

export default function AssignPage() {
  return (
    <div>
      <div style={{ margin: '25px', backgroundColor: 'white' }}>
        <h1 className="text-2xl font-semibold text-gray-900">Assign Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">Assign technicians to open jobs.</p>
      </div>
      <AssignTable />
    </div>
  );
}
