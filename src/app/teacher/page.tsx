import Header from '../../components/common/Header/Header';

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
        <p>Welcome to the Teacher dashboard. Here you can manage your classes, lessons, and student progress.</p>
      </main>
    </div>
  );
}