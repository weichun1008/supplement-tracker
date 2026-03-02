'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/app/lib/i18n/LanguageContext';
import AddMedicationModal from '@/app/components/AddMedicationModal';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default function MedicationsPage() {
    const { t } = useLanguage();
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const fetchMedications = useCallback(async () => {
        try {
            const res = await fetch(`/api/medications${showAll ? '?all=true' : ''}`);
            if (res.ok) {
                setMedications(await res.json());
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }, [showAll]);

    useEffect(() => {
        fetchMedications();
    }, [fetchMedications]);

    const handleSave = async (formData) => {
        try {
            if (editData) {
                await fetch(`/api/medications/${editData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch('/api/medications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }
            setModalOpen(false);
            setEditData(null);
            fetchMedications();
        } catch (err) {
            console.error('Save error:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/medications/${id}`, { method: 'DELETE' });
            setDeleteConfirm(null);
            fetchMedications();
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const openEdit = (medication) => {
        setEditData(medication);
        setModalOpen(true);
    };

    const openAdd = () => {
        setEditData(null);
        setModalOpen(true);
    };

    const typeIcons = { prescription: '💊', otc: '🏪', chinese_medicine: '🌿' };
    const typeLabels = {
        prescription: t('medications.prescription'),
        otc: t('medications.otc'),
        chinese_medicine: t('medications.chineseMedicine'),
    };
    const timeIcons = { morning: '🌅', afternoon: '☀️', evening: '🌙' };
    const timeLabels = {
        morning: t('supplements.morning'),
        afternoon: t('supplements.afternoon'),
        evening: t('supplements.evening'),
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container"><div className="spinner"></div></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <LanguageSwitcher />

            <div className="page-header">
                <h1 className="page-title">{t('medications.title')}</h1>
            </div>

            {/* Action Buttons */}
            <div className="action-group">
                <button className="btn-action primary" onClick={openAdd}>
                    ➕ {t('medications.add')}
                </button>
                <button
                    className={`btn-action ${showAll ? 'primary' : ''}`}
                    onClick={() => { setShowAll(!showAll); setLoading(true); }}
                >
                    {showAll ? `📋 ${t('medications.showActive')}` : `📋 ${t('medications.showAll')}`}
                </button>
            </div>

            <div>
                {medications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">💉</div>
                        <p className="empty-title">{t('medications.empty')}</p>
                        <p className="empty-hint">{t('medications.emptyHint')}</p>
                    </div>
                ) : (
                    medications.map((med, idx) => (
                        <div
                            key={med.id}
                            className={`medication-card slide-in ${!med.is_active ? 'inactive' : ''}`}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="supplement-card-header">
                                <div>
                                    <div className="supplement-card-name">
                                        {typeIcons[med.type]} {med.name}
                                    </div>
                                    {!med.is_active && (
                                        <span className="med-status-badge inactive">{t('medications.inactive')}</span>
                                    )}
                                </div>
                                <div className="supplement-card-actions">
                                    <button className="icon-btn" onClick={() => openEdit(med)} title={t('common.edit')}>
                                        ✏️
                                    </button>
                                    <button className="icon-btn danger" onClick={() => setDeleteConfirm(med.id)} title={t('common.delete')}>
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="supplement-card-meta">
                                {med.dosage && <span className="meta-tag">💊 {med.dosage}</span>}
                                <span className="meta-tag">{timeIcons[med.time_of_day]} {timeLabels[med.time_of_day]}</span>
                                <span className="meta-tag">🏷️ {typeLabels[med.type]}</span>
                            </div>
                            {(med.start_date || med.end_date) && (
                                <div className="med-dates">
                                    📅 {med.start_date ? formatDate(med.start_date) : '...'} → {med.end_date ? formatDate(med.end_date) : t('medications.ongoing')}
                                </div>
                            )}
                            {med.prescribing_doctor && (
                                <div className="med-doctor">🩺 {med.prescribing_doctor}</div>
                            )}
                            {med.notes && (
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
                                    {med.notes}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>

            <AddMedicationModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSave={handleSave}
                editData={editData}
            />

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal-content confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">{t('common.delete')}</h2>
                        <p>{t('medications.deleteConfirm')}</p>
                        <div className="confirm-actions">
                            <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>
                                {t('common.cancel')}
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                                {t('common.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
