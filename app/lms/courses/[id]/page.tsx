export const runtime = 'edge';

export default function Course({ params }: { params: { id: string } }) {
  return (<><h1>Course {params.id}</h1><p>LMS lessons + assignments in P4.</p></>);
}
