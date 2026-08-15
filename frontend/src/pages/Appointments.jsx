import { useState, useEffect } from 'react';
import appointmentService from '../services/appointmentService';
import {
  Calendar,
  Clock,
  Plus,
  Loader2,
  AlertCircle,
  Stethoscope,
  CheckCircle2
} from 'lucide-react';

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [doctorName, setDoctorName] = useState('Dr. Sarah Jenkins');
  const [specialty, setSpecialty] = useState('General Cardiology');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('10:30');
  const [reason, setReason] = useState('Annual routine cardiovascular checkup');
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data || []);
    } catch {
      setError('Failed to load appointments. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    appointmentService.getAppointments()
      .then((data) => {
        if (isMounted) {
          setAppointments(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load appointments. Please check backend connection.');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError(null);
    setActionSuccess('');

    try {
      await appointmentService.createAppointment({
        doctorName,
        specialty,
        appointmentDate,
        appointmentTime,
        reason,
      });
      setActionSuccess('Appointment successfully scheduled!');
      setShowModal(false);
      fetchAppointments();
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || 'Failed to book appointment.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setError(null);
    setActionSuccess('');
    try {
      await appointmentService.cancelAppointment(id);
      setActionSuccess('Appointment cancelled successfully.');
      fetchAppointments();
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || 'Failed to cancel appointment.'
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300';
      case 'COMPLETED':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-sky-600/90 to-teal-600/90 text-white rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Clinical Appointments
            </h1>
          </div>
          <p className="text-sky-100 text-sm sm:text-base max-w-xl">
            Book consultations with medical specialists, manage upcoming schedules, and view appointment history.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl bg-white text-sky-700 font-bold hover:bg-sky-50 shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-lg p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-sky-600" />
                <span>Schedule New Appointment</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Medical Specialty
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
                >
                  <option value="General Physician">General Physician</option>
                  <option value="General Cardiology">General Cardiology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time (HH:mm)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10:30"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md flex items-center space-x-2"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <span>Confirm Booking</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mb-2" />
          <p className="font-medium animate-pulse">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="glass-card p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Appointments Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You currently have no booked or past clinical appointments.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-4 px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md inline-flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule First Appointment</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="glass-card p-5 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    {app.doctorName}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold">
                    {app.specialty}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Reason: <span className="font-medium text-slate-800 dark:text-slate-200">{app.reason}</span>
                </p>
                <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-sky-600" />
                    {app.appointmentDate}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-sky-600" />
                    {app.appointmentTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>

                {app.status === 'BOOKED' && (
                  <button
                    type="button"
                    onClick={() => handleCancel(app.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-200 dark:border-rose-800"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
