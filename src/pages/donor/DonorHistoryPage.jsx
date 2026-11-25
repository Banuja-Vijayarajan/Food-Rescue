import React, { useState, useMemo } from 'react';
import {
  History, Calendar, Filter, Search, TrendingUp, AlertTriangle,
  CheckCircle2, Utensils, Leaf, Award, Download, Eye, FileText,
  ShieldCheck, X, ChevronRight, Clock, MapPin, Building2, User, Printer
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { DONOR_HISTORY } from '../../data/donorMockData';

export default function DonorHistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCertificate, setActiveCertificate] = useState(null);

  const months = [
    { id: 'all', label: 'All Months' },
    { id: '2026-10', label: 'October 2026' },
    { id: '2026-09', label: 'September 2026' },
    { id: '2026-08', label: 'August 2026' },
    { id: '2026-07', label: 'July 2026' },
  ];

  // Filtered dataset
  const filteredHistory = useMemo(() => {
    return DONOR_HISTORY.filter(item => {
      // Month filter
      if (selectedMonth !== 'all' && item.month !== selectedMonth) {
        return false;
      }
      // Status filter
      if (statusFilter === 'rescued' && item.status !== 'Fully Rescued') {
        return false;
      }
      if (statusFilter === 'partial' && item.status !== 'Partially Rescued') {
        return false;
      }
      if (statusFilter === 'wasted' && item.status !== 'Expired (Wasted)') {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesMeal = item.meal.toLowerCase().includes(q);
        const matchesOrg = item.recipient.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesMeal && !matchesOrg && !matchesCat) return false;
      }
      return true;
    });
  }, [selectedMonth, statusFilter, searchQuery]);

  // Aggregate Metrics based on selected month (or all)
  const metrics = useMemo(() => {
    const subset = selectedMonth === 'all' 
      ? DONOR_HISTORY 
      : DONOR_HISTORY.filter(h => h.month === selectedMonth);

    const totalPosted = subset.reduce((acc, cur) => acc + (cur.portionsPosted || 0), 0);
    const totalRescued = subset.reduce((acc, cur) => acc + (cur.portionsRescued || 0), 0);
    const totalWasted = subset.reduce((acc, cur) => acc + (cur.portionsWasted || 0), 0);
    const totalCO2 = subset.reduce((acc, cur) => acc + (cur.co2 || 0), 0);

    const rescueEfficiency = totalPosted > 0 
      ? Math.round((totalRescued / totalPosted) * 100) 
      : 100;
    const wasteRate = totalPosted > 0 
      ? (100 - rescueEfficiency) 
      : 0;

    return {
      totalPosted,
      totalRescued,
      totalWasted,
      totalCO2: totalCO2.toFixed(1),
      rescueEfficiency,
      wasteRate,
      donationCount: subset.filter(s => s.portionsRescued > 0).length,
      wasteCount: subset.filter(s => s.portionsWasted > 0).length,
    };
  }, [selectedMonth]);

  const handleDownloadPDF = (cert) => {
    if (!cert) return;
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Decorative double border
      doc.setDrawColor(25, 195, 125);
      doc.setLineWidth(1.4);
      doc.rect(10, 10, 190, 277);

      doc.setDrawColor(200, 230, 215);
      doc.setLineWidth(0.4);
      doc.rect(12, 12, 186, 273);

      // Header Brand
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(25, 195, 125);
      doc.setFontSize(18);
      doc.text('FOOD RESCUE REDISTRIBUTION NETWORK', 105, 24, { align: 'center' });

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Smart Food Surplus Management & Safe Redistribution System', 105, 30, { align: 'center' });

      doc.setDrawColor(226, 232, 240);
      doc.line(20, 35, 190, 35);

      // Certificate Title
      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42);
      doc.text('OFFICIAL CERTIFICATE OF SURPLUS FOOD HANDOVER', 105, 45, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(25, 195, 125);
      doc.text(`VERIFICATION CODE: ${cert.verificationCode || 'FR-VAV-8891'}`, 105, 52, { align: 'center' });

      // Certify statement
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text('This is to officially certify that the culinary surplus detailed below was safely inspected,', 105, 62, { align: 'center' });
      doc.text('temperature verified, and successfully handed over for humanitarian welfare redistribution.', 105, 68, { align: 'center' });

      // Surplus Meal Card
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(20, 75, 170, 28, 3, 3, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(20, 75, 170, 28, 3, 3, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('SURPLUS MEAL TITLE & CATEGORY', 26, 83);
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(cert.meal || 'Prepared Meal', 26, 90);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Category: ${cert.category || 'Prepared Meal'}   |   Dispatch Time: ${cert.date || 'Oct 2026'} at ${cert.time || '09:45 PM'}`, 26, 97);

      // Details Table
      const items = [
        ['Donor Business Name', 'Green Leaf Hotel & Banquets, Vavuniya'],
        ['Authorized Donor Officer', 'Mr. Rohan Fernando (Food Rescue Manager)'],
        ['Recipient Organization', `${cert.recipient} (${cert.recipientType || 'Welfare Center'})`],
        ['Portions Offered / Posted', `${cert.portionsPosted} portions`],
        ['Portions Rescued / Handed Over', `${cert.portionsRescued} portions (100% Verified)`],
        ['Handover Food Temperature', `${cert.tempAtHandover || '68°C'} (Standard Hot-Holding Compliant)`],
        ['Designated Handover Bay', 'Gate 2 - Kitchen Service Bay & Ramp'],
        ['Transport Logistics Driver', cert.driver || 'Mr. Kumaran'],
      ];

      let curY = 114;
      items.forEach(([lbl, val], idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(248, 252, 250);
          doc.rect(20, curY - 5, 170, 10, 'F');
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(lbl + ':', 26, curY + 2);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(val, 85, curY + 2);

        doc.setDrawColor(241, 245, 249);
        doc.line(20, curY + 5, 190, curY + 5);
        curY += 12;
      });

      // Food Hygiene & Safety Box
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(20, 218, 170, 22, 3, 3, 'F');
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(20, 218, 170, 22, 3, 3, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(22, 101, 52);
      doc.text('PUBLIC HEALTH & FOOD HYGIENE COMPLIANCE GUARANTEE', 26, 227);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(21, 128, 61);
      doc.text('Surplus collected strictly within safe consumption timeframes under PHI Grade A food safety standards.', 26, 234);

      // Save document
      doc.save(`Food_Rescue_Certificate_${cert.verificationCode || 'FR'}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Date,Time,Meal,Category,Recipient,Portions Posted,Portions Rescued,Portions Wasted,Status,CO2 Saved (kg),Verification Code\n'];
    const rows = filteredHistory.map(h => 
      `"${h.id}","${h.date}","${h.time}","${h.meal}","${h.category}","${h.recipient}","${h.portionsPosted}","${h.portionsRescued}","${h.portionsWasted}","${h.status}","${h.co2}","${h.verificationCode}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Green_Leaf_Donation_History_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fr-dash-view">
      
      {/* Top Banner Header */}
      <div className="fr-page-header">
        <div>
          <h1 className="fr-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={26} color="var(--fr-primary)" />
            Donation History & Food Waste Analytics
          </h1>
          <p className="fr-page-sub">
            Track Green Leaf Hotel's past surplus redistributions, monthly rescue efficiency, and waste prevention audit logs.
          </p>
        </div>

        <button 
          type="button" 
          className="fr-btn fr-btn-secondary"
          onClick={handleExportCSV}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          title="Download complete audit log"
        >
          <Download size={16} /> Export Audit Log (CSV)
        </button>
      </div>

      {/* Monthly Dynamic Analytics KPI Cards */}
      <div className="fr-stats-grid fr-history-kpi-grid">
        
        {/* Total Posted */}
        <div className="fr-stat-card fr-stat-sky">
          <div className="fr-stat-top">
            <span className="fr-stat-label">Total Surplus Posted</span>
            <div className="fr-stat-icon-wrap"><Utensils size={18} /></div>
          </div>
          <div className="fr-stat-value">{metrics.totalPosted}</div>
          <div className="fr-stat-sub">
            {selectedMonth === 'all' ? 'All-time culinary surplus' : `Surplus in ${months.find(m => m.id === selectedMonth)?.label}`}
          </div>
        </div>

        {/* Successfully Rescued */}
        <div className="fr-stat-card fr-stat-emerald">
          <div className="fr-stat-top">
            <span className="fr-stat-label">Successfully Rescued</span>
            <div className="fr-stat-icon-wrap"><CheckCircle2 size={18} /></div>
          </div>
          <div className="fr-stat-value">
            {metrics.totalRescued} <span style={{ fontSize: '1rem', fontWeight: '600' }}>({metrics.rescueEfficiency}%)</span>
          </div>
          <div className="fr-stat-sub">
            ✓ Delivered to vetted orphanages & shelters
          </div>
        </div>

        {/* Expired / Wasted */}
        <div className="fr-stat-card fr-stat-danger">
          <div className="fr-stat-top">
            <span className="fr-stat-label">Unclaimed / Wasted</span>
            <div className="fr-stat-icon-wrap">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="fr-stat-value">
            {metrics.totalWasted} <span style={{ fontSize: '1rem', fontWeight: '600' }}>({metrics.wasteRate}%)</span>
          </div>
          <div className="fr-stat-sub">
            {metrics.wasteCount} items expired before dispatch
          </div>
        </div>

        {/* Total CO2 Offset */}
        <div className="fr-stat-card fr-stat-lime">
          <div className="fr-stat-top">
            <span className="fr-stat-label">CO₂e Emissions Saved</span>
            <div className="fr-stat-icon-wrap"><Leaf size={18} /></div>
          </div>
          <div className="fr-stat-value">
            {metrics.totalCO2} kg
          </div>
          <div className="fr-stat-sub">Greenhouse gases diverted from landfills</div>
        </div>
      </div>

      {/* Visual Efficiency Ratio Bar */}
      <div className="fr-section-card fr-ratio-card">
        <div className="fr-ratio-header">
          <div className="fr-ratio-title-group">
            <TrendingUp size={18} color="var(--fr-primary)" />
            <span className="fr-ratio-title">
              Rescue Efficiency vs Food Waste Ratio
            </span>
            <span className="fr-ratio-sub">
              ({selectedMonth === 'all' ? 'All Months Combined' : months.find(m => m.id === selectedMonth)?.label})
            </span>
          </div>

          <div className="fr-ratio-legend">
            <span className="fr-ratio-legend-rescued">
              <span className="fr-ratio-dot rescued" />
              Rescued: {metrics.totalRescued} portions ({metrics.rescueEfficiency}%)
            </span>
            <span className="fr-ratio-legend-wasted">
              <span className="fr-ratio-dot wasted" />
              Wasted: {metrics.totalWasted} portions ({metrics.wasteRate}%)
            </span>
          </div>
        </div>

        {/* Progress bar container */}
        <div className="fr-ratio-bar-track">
          <div 
            className="fr-ratio-bar-rescued"
            style={{ width: `${metrics.rescueEfficiency}%` }} 
            title={`Rescued: ${metrics.rescueEfficiency}%`}
          />
          <div 
            className="fr-ratio-bar-wasted"
            style={{ width: `${metrics.wasteRate}%` }} 
            title={`Wasted: ${metrics.wasteRate}%`}
          />
        </div>

        {/* Waste Reduction Insight */}
        <div className="fr-ratio-insight">
          <Award size={16} color="var(--fr-primary)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Hotel Surplus Insight:</strong> Green Leaf Hotel maintains a <strong>{metrics.rescueEfficiency}%</strong> rescue benchmark. Donations released before 08:30 PM experience a <strong>98%</strong> on-time shelter collection rate.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="fr-section-card fr-filter-card">
        <div className="fr-filter-rows-wrap">
          
          {/* Row 1: Month Pills & Search Bar */}
          <div className="fr-filter-row-top">
            
            {/* Month Filter Selector */}
            <div className="fr-filter-month-group">
              <span className="fr-filter-label">
                <Calendar size={15} /> MONTH:
              </span>
              <div className="fr-filter-pills">
                {months.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    className={`fr-pill ${selectedMonth === m.id ? 'active' : ''}`}
                    onClick={() => setSelectedMonth(m.id)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="fr-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search meal, recipient, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--fr-text-muted)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Status Filter Pills */}
          <div className="fr-filter-row-bottom">
            <span className="fr-filter-label">
              <Filter size={14} /> STATUS FILTER:
            </span>
            <button
              type="button"
              className={`fr-pill ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Records ({DONOR_HISTORY.filter(h => selectedMonth === 'all' || h.month === selectedMonth).length})
            </button>
            <button
              type="button"
              className={`fr-pill ${statusFilter === 'rescued' ? 'active' : ''}`}
              onClick={() => setStatusFilter('rescued')}
              style={statusFilter === 'rescued' ? { background: '#10b981', borderColor: '#10b981' } : {}}
            >
              ✓ Fully Rescued ({DONOR_HISTORY.filter(h => (selectedMonth === 'all' || h.month === selectedMonth) && h.status === 'Fully Rescued').length})
            </button>
            <button
              type="button"
              className={`fr-pill ${statusFilter === 'partial' ? 'active' : ''}`}
              onClick={() => setStatusFilter('partial')}
              style={statusFilter === 'partial' ? { background: '#f59e0b', borderColor: '#f59e0b', color: '#fff' } : {}}
            >
              ⚠ Partially Rescued ({DONOR_HISTORY.filter(h => (selectedMonth === 'all' || h.month === selectedMonth) && h.status === 'Partially Rescued').length})
            </button>
            <button
              type="button"
              className={`fr-pill ${statusFilter === 'wasted' ? 'active' : ''}`}
              onClick={() => setStatusFilter('wasted')}
              style={statusFilter === 'wasted' ? { background: '#ef4444', borderColor: '#ef4444', color: '#fff' } : {}}
            >
              ✕ Expired / Wasted ({DONOR_HISTORY.filter(h => (selectedMonth === 'all' || h.month === selectedMonth) && h.status === 'Expired (Wasted)').length})
            </button>
          </div>

        </div>
      </div>

      {/* Main Donation History Table */}
      <div className="fr-section-card">
        <div className="fr-section-header">
          <div>
            <div className="fr-section-title">
              Surplus Redistribution & Waste Audit Log
            </div>
            <div className="fr-section-sub">
              Showing {filteredHistory.length} donation records
            </div>
          </div>

          <span className="fr-count-badge">
            {filteredHistory.length} Records Found
          </span>
        </div>

        <div className="fr-table-wrap">
          <table className="fr-table">
            <thead>
              <tr>
                <th>DATE & TIME</th>
                <th>SURPLUS MEAL & CATEGORY</th>
                <th>POSTED</th>
                <th>RESCUED</th>
                <th>WASTED</th>
                <th>RECIPIENT ORGANIZATION</th>
                <th>STATUS</th>
                <th>CO₂ SAVED</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="fr-empty-state">
                      <History size={36} color="var(--fr-text-muted)" />
                      <p>No donation history matches the selected filters</p>
                      <span>Try changing the selected month or status filter above</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map(item => {
                  const isFullyRescued = item.status === 'Fully Rescued';
                  const isPartiallyRescued = item.status === 'Partially Rescued';
                  const isExpired = item.status === 'Expired (Wasted)';

                  return (
                    <tr key={item.id}>
                      {/* Date & Time */}
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--fr-text-heading)' }}>{item.date}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Clock size={12} /> {item.time}
                        </div>
                      </td>

                      {/* Meal & Category */}
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--fr-text-heading)', maxWidth: '240px', lineHeight: 1.3 }}>
                          {item.meal}
                        </div>
                        <span className="fr-category-tag">
                          {item.category}
                        </span>
                      </td>

                      {/* Posted Portions */}
                      <td>
                        <strong style={{ fontSize: '0.92rem' }}>{item.portionsPosted}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--fr-text-muted)', display: 'block' }}>portions</span>
                      </td>

                      {/* Rescued Portions */}
                      <td>
                        {item.portionsRescued > 0 ? (
                          <span className="fr-portions-rescued-badge">
                            ✓ {item.portionsRescued}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--fr-text-muted)' }}>0</span>
                        )}
                      </td>

                      {/* Wasted Portions */}
                      <td>
                        {item.portionsWasted > 0 ? (
                          <span 
                            className="fr-portions-wasted-badge"
                            title={item.wasteReason || 'Expired surplus'}
                          >
                            ⚠ {item.portionsWasted}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--fr-primary)', fontWeight: '600' }}>0 (0%)</span>
                        )}
                      </td>

                      {/* Recipient */}
                      <td>
                        <div className="fr-recipient-cell">
                          <div className={`fr-recipient-avatar-box ${isExpired ? 'expired' : 'normal'}`}>
                            {item.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.84rem', color: 'var(--fr-text-heading)' }}>
                              {item.recipient}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--fr-text-muted)' }}>
                              {item.recipientType}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td>
                        {isFullyRescued && (
                          <span className="fr-status-badge badge-collected">
                            <CheckCircle2 size={12} /> Fully Rescued
                          </span>
                        )}
                        {isPartiallyRescued && (
                          <span className="fr-status-badge badge-requested">
                            <AlertTriangle size={12} /> Partially Rescued
                          </span>
                        )}
                        {isExpired && (
                          <span className="fr-status-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                            <X size={12} /> Expired (Wasted)
                          </span>
                        )}
                      </td>

                      {/* CO2 Impact */}
                      <td>
                        {item.co2 > 0 ? (
                          <span style={{ fontWeight: '700', color: 'var(--fr-accent-lime)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Leaf size={12} /> {item.co2} kg
                          </span>
                        ) : (
                          <span style={{ color: 'var(--fr-text-muted)', fontSize: '0.8rem' }}>0 kg</span>
                        )}
                      </td>

                      {/* Action */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="fr-btn fr-btn-secondary fr-btn-sm"
                          onClick={() => setActiveCertificate(item)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          title="View Handover Verification Proof"
                        >
                          <Eye size={13} /> View Proof
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Handover Certificate Modal */}
      {activeCertificate && (
        <div className="fr-cert-backdrop">
          <div className="fr-cert-dialog">
            {/* Modal Header */}
            <div className="fr-cert-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="var(--fr-primary)" />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--fr-text-heading)' }}>
                    Certificate Preview
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--fr-primary)', fontWeight: '600' }}>
                    Verification Code: {activeCertificate.verificationCode}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="fr-icon-btn"
                onClick={() => setActiveCertificate(null)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body: Authentic Certificate Sheet Preview */}
            <div className="fr-cert-modal-body">
              {/* Printable Certificate Sheet */}
              <div id="printable-certificate" className="fr-cert-sheet">
                {/* Double Border Inset */}
                <div className="fr-cert-sheet-inner">
                  {/* Top Seal & Organization Title */}
                  <div className="fr-cert-brand-header">
                    <div className="fr-cert-verified-pill">
                      <ShieldCheck size={14} /> Official Verified Document
                    </div>
                    <div className="fr-cert-network-title">
                      FOOD RESCUE REDISTRIBUTION NETWORK
                    </div>
                    <div className="fr-cert-network-sub">
                      National Food Surplus Management & Safe Redistribution System
                    </div>
                  </div>

                  {/* Certificate Title */}
                  <div className="fr-cert-doc-header">
                    <div className="fr-cert-doc-title">
                      Certificate of Surplus Food Handover
                    </div>
                    <div className="fr-cert-doc-meta">
                      Verification ID: <strong style={{ color: 'var(--fr-text-heading)' }}>{activeCertificate.verificationCode}</strong> • Issued on {activeCertificate.date}
                    </div>
                  </div>

                  {/* Surplus Meal Details Card */}
                  <div className="fr-cert-meal-card">
                    <div className="fr-cert-meal-label">
                      Surplus Meal Description
                    </div>
                    <div className="fr-cert-meal-name">
                      {activeCertificate.meal}
                    </div>
                    <div className="fr-cert-meal-time">
                      Category: {activeCertificate.category} • Handover Time: {activeCertificate.date} at {activeCertificate.time}
                    </div>
                  </div>

                  {/* 2-Column Key Particulars */}
                  <div className="fr-cert-grid">
                    <div className="fr-cert-field-card">
                      <span className="fr-cert-field-label">
                        Donor Business
                      </span>
                      <span className="fr-cert-field-value">
                        Green Leaf Hotel & Banquets
                      </span>
                    </div>

                    <div className="fr-cert-field-card">
                      <span className="fr-cert-field-label">
                        Recipient Partner
                      </span>
                      <span className="fr-cert-field-value">
                        {activeCertificate.recipient}
                      </span>
                    </div>

                    <div className="fr-cert-field-card">
                      <span className="fr-cert-field-label">
                        Portions Rescued
                      </span>
                      <span className="fr-cert-field-value" style={{ color: 'var(--fr-primary)', fontWeight: '700' }}>
                        ✓ {activeCertificate.portionsRescued} of {activeCertificate.portionsPosted} portions
                      </span>
                    </div>

                    <div className="fr-cert-field-card">
                      <span className="fr-cert-field-label">
                        Temperature at Handover
                      </span>
                      <span className="fr-cert-field-value">
                        {activeCertificate.tempAtHandover}
                      </span>
                    </div>

                    <div className="fr-cert-field-card full-width">
                      <span className="fr-cert-field-label">
                        Transport Logistics Driver
                      </span>
                      <span className="fr-cert-field-value">
                        {activeCertificate.driver}
                      </span>
                    </div>
                  </div>

                  {activeCertificate.wasteReason && (
                    <div className="fr-cert-waste-box">
                      <strong>Waste Audit Note:</strong> {activeCertificate.wasteReason}
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Modal Footer with Real PDF Download and Print */}
            <div className="fr-cert-modal-footer">
              <button
                type="button"
                className="fr-btn fr-btn-secondary"
                onClick={() => setActiveCertificate(null)}
              >
                Close
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="fr-btn fr-btn-secondary"
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Print Certificate"
                >
                  <Printer size={15} /> Print
                </button>

                <button
                  type="button"
                  className="fr-btn fr-btn-primary"
                  onClick={() => handleDownloadPDF(activeCertificate)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={15} /> Download PDF File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
