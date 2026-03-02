'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';

export default function AddMedicationModal({ isOpen, onClose, onSave, editData }) {
    const { t } = useLanguage();
    const [form, setForm] = useState({
        name: '',
        type: 'prescription',
        dosage: '',
        frequency: 'daily',
        time_of_day: 'morning',
        start_date: '',
        end_date: '',
        prescribing_doctor: '',
        notes: '',
    });

    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.name || '',
                type: editData.type || 'prescription',
                dosage: editData.dosage || '',
                frequency: editData.frequency || 'daily',
                time_of_day: editData.time_of_day || 'morning',
                start_date: editData.start_date ? editData.start_date.split('T')[0] : '',
                end_date: editData.end_date ? editData.end_date.split('T')[0] : '',
                prescribing_doctor: editData.prescribing_doctor || '',
                notes: editData.notes || '',
            });
        } else {
            setForm({
                name: '', type: 'prescription', dosage: '', frequency: 'daily',
                time_of_day: 'morning', start_date: '', end_date: '',
                prescribing_doctor: '', notes: '',
            });
        }
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        onSave(form);
    };

    const typeOptions = [
        { value: 'prescription', label: t('medications.prescription'), icon: '💊' },
        { value: 'otc', label: t('medications.otc'), icon: '🏪' },
        { value: 'chinese_medicine', label: t('medications.chineseMedicine'), icon: '🌿' },
    ];

    const timeOptions = [
        { value: 'morning', label: t('supplements.morning'), icon: '🌅' },
        { value: 'afternoon', label: t('supplements.afternoon'), icon: '☀️' },
        { value: 'evening', label: t('supplements.evening'), icon: '🌙' },
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">
                    {editData ? t('medications.edit') : t('medications.add')}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">{t('medications.name')} *</label>
                        <input
                            className="form-input"
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder={t('medications.namePlaceholder')}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('medications.type')}</label>
                        <div className="time-pills">
                            {typeOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`time-pill ${form.type === opt.value ? 'active' : ''}`}
                                    onClick={() => setForm({ ...form, type: opt.value })}
                                >
                                    {opt.icon} {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('medications.dosage')}</label>
                        <input
                            className="form-input"
                            type="text"
                            value={form.dosage}
                            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                            placeholder={t('medications.dosagePlaceholder')}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('supplements.frequency')}</label>
                        <select
                            className="form-select"
                            value={form.frequency}
                            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                        >
                            <option value="daily">{t('supplements.daily')}</option>
                            <option value="weekdays">{t('supplements.weekdays')}</option>
                            <option value="custom">{t('supplements.custom')}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('supplements.timeOfDay')}</label>
                        <div className="time-pills">
                            {timeOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    className={`time-pill ${form.time_of_day === opt.value ? 'active' : ''}`}
                                    onClick={() => setForm({ ...form, time_of_day: opt.value })}
                                >
                                    {opt.icon} {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group form-half">
                            <label className="form-label">{t('medications.startDate')}</label>
                            <input
                                className="form-input"
                                type="date"
                                value={form.start_date}
                                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                            />
                        </div>
                        <div className="form-group form-half">
                            <label className="form-label">{t('medications.endDate')}</label>
                            <input
                                className="form-input"
                                type="date"
                                value={form.end_date}
                                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('medications.doctor')}</label>
                        <input
                            className="form-input"
                            type="text"
                            value={form.prescribing_doctor}
                            onChange={(e) => setForm({ ...form, prescribing_doctor: e.target.value })}
                            placeholder={t('medications.doctorPlaceholder')}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{t('supplements.notes')}</label>
                        <textarea
                            className="form-input"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            placeholder={t('supplements.notesPlaceholder')}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            {t('common.cancel')}
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
