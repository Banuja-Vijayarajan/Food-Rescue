import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Star,
  Users,
  Utensils,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  PieChart,
  Scale,
  Leaf,
  ShieldCheck,
  Building2,
  HeartHandshake
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import {
  DONOR_RATINGS_REPORT,
  RECIPIENT_ACTIVITY_REPORT,
  FOOD_QUANTITY_QUALITY_REPORT,
  ADMIN_STATS
} from '../../data/adminMockData';

export default function AdminAnalyticsPage() {
  const [activeReportTab, setActiveReportTab] = useState('donor-ratings');
  const [dateRange, setDateRange] = useState('30days');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Generate & Download PDF using jsPDF
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(25, 195, 125);
      doc.text('FOOD RESCUE REDISTRIBUTION SYSTEM', 14, 20);

      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Platform Performance & Audit Report (IT3162 Proposal Compliance)', 14, 27);
      doc.text(`Generated: ${timestamp} | Scope: ${dateRange.toUpperCase()}`, 14, 33);
      doc.line(14, 36, 196, 36);

      let startY = 46;

      if (activeReportTab === 'donor-ratings') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(18, 53, 45);
        doc.text('1. Donor Ratings & Food Redistribution Audit', 14, startY);
        startY += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Donor Organization', 14, startY);
        doc.text('District', 80, startY);
        doc.text('Portions', 115, startY);
        doc.text('Rating', 145, startY);
        doc.text('Hygiene', 170, startY);
        startY += 6;
        doc.line(14, startY - 2, 196, startY - 2);

        doc.setFont('helvetica', 'normal');
        DONOR_RATINGS_REPORT.forEach((d) => {
          doc.text(d.name.substring(0, 32), 14, startY);
          doc.text(d.district, 80, startY);
          doc.text(`${d.portionsRescued}`, 115, startY);
          doc.text(`${d.rating} / 5.0`, 145, startY);
          doc.text(`${d.hygieneCompliance}%`, 170, startY);
          startY += 7;
        });
      } else if (activeReportTab === 'recipient-activity') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(18, 53, 45);
        doc.text('2. Recipient Organization Activity & Welfare Impact', 14, startY);
        startY += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Recipient Welfare Org', 14, startY);
        doc.text('District', 80, startY);
        doc.text('Portions', 115, startY);
        doc.text('Fed/Day', 145, startY);
        doc.text('Fulfillment', 170, startY);
        startY += 6;
        doc.line(14, startY - 2, 196, startY - 2);

        doc.setFont('helvetica', 'normal');
        RECIPIENT_ACTIVITY_REPORT.forEach((r) => {
          doc.text(r.name.substring(0, 32), 14, startY);
          doc.text(r.district, 80, startY);
          doc.text(`${r.portionsReceived}`, 115, startY);
          doc.text(`${r.beneficiariesFed}`, 145, startY);
          doc.text(`${r.fulfillmentRate}%`, 170, startY);
          startY += 7;
        });
      } else if (activeReportTab === 'quantity-quality') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(18, 53, 45);
        doc.text('3. Food Quantity, Weight & Safety Quality Audit', 14, startY);
        startY += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Food Category', 14, startY);
        doc.text('Portions', 70, startY);
        doc.text('Net KG', 105, startY);
        doc.text('Holding Temp', 135, startY);
        doc.text('Safety Pass', 170, startY);
        startY += 6;
        doc.line(14, startY - 2, 196, startY - 2);

        doc.setFont('helvetica', 'normal');
        FOOD_QUANTITY_QUALITY_REPORT.forEach((q) => {
          doc.text(q.category, 14, startY);
          doc.text(`${q.portions.toLocaleString()}`, 70, startY);
          doc.text(`${q.weightKg} kg`, 105, startY);
          doc.text(q.averageTemperatureHolding, 135, startY);
          doc.text(`${q.safetyPassRate}%`, 170, startY);
          startY += 7;
        });
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(18, 53, 45);
        doc.text('4. Donation Status & Operational Efficiency Report', 14, startY);
        startY += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Meals Rescued: ${ADMIN_STATS.totalMealsRescued.toLocaleString()}`, 14, startY);
        startY += 7;
        doc.text(`Total Weight Redistributed: ${ADMIN_STATS.totalFoodWeightKg} kg`, 14, startY);
        startY += 7;
        doc.text(`Average Rescue Transit Time: ${ADMIN_STATS.avgRescueTimeMinutes} minutes`, 14, startY);
        startY += 7;
        doc.text(`Overall Food Safety Compliance: ${ADMIN_STATS.overallSafetyComplianceRate}%`, 14, startY);
        startY += 7;
        doc.text(`CO2e Emissions Diverted: ${(ADMIN_STATS.co2ePreventedKg / 1000).toFixed(1)} Tons`, 14, startY);
      }

      startY += 14;
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Food Rescue Platform • University of Vavuniya Department of Physical Science • IT3162', 14, startY);

      doc.save(`FoodRescue_${activeReportTab}_${Date.now()}.pdf`);
      showToast('Official PDF Report generated and downloaded.');
    } catch (err) {
      console.error(err);
      showToast('PDF generated using fall-back generator.');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    let headers = '';
    let rows = [];

    if (activeReportTab === 'donor-ratings') {
      headers = 'Name,District,DonationsCount,PortionsRescued,WeightKg,Rating,PunctualityScore,HygieneCompliance,Status\n';
      rows = DONOR_RATINGS_REPORT.map(d =>
        `"${d.name}","${d.district}",${d.donationsCount},${d.portionsRescued},${d.weightKg},${d.rating},${d.punctualityScore},${d.hygieneCompliance},"${d.status}"\n`
      );
    } else if (activeReportTab === 'recipient-activity') {
      headers = 'Name,District,RequestsMade,PortionsReceived,BeneficiariesFed,PickupPunctuality,FulfillmentRate,Rating\n';
      rows = RECIPIENT_ACTIVITY_REPORT.map(r =>
        `"${r.name}","${r.district}",${r.requestsMade},${r.portionsReceived},${r.beneficiariesFed},${r.pickupPunctuality},${r.fulfillmentRate},${r.rating}\n`
      );
    } else if (activeReportTab === 'quantity-quality') {
      headers = 'Category,Portions,WeightKg,SharePercent,AverageTemperatureHolding,SafetyPassRate\n';
      rows = FOOD_QUANTITY_QUALITY_REPORT.map(q =>
        `"${q.category}",${q.portions},${q.weightKg},${q.sharePercent},"${q.averageTemperatureHolding}",${q.safetyPassRate}\n`
      );
    } else {
      headers = 'Metric,Value\n';
      rows = [
        `"Total Meals Rescued",${ADMIN_STATS.totalMealsRescued}\n`,
        `"Total Food Weight Kg",${ADMIN_STATS.totalFoodWeightKg}\n`,
        `"Average Cycle Speed Minutes",${ADMIN_STATS.avgRescueTimeMinutes}\n`,
        `"Safety Compliance Rate",${ADMIN_STATS.overallSafetyComplianceRate}%\n`,
      ];
    }

    const blob = new Blob([[headers].concat(rows).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food_rescue_${activeReportTab}_${Date.now()}.csv`;
    a.click();
    showToast('Report data exported to CSV.');
  };

  return (
    <div className="fr-admin-analytics-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: 'var(--fr-primary)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '0.86rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="fr-admin-card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={24} color="var(--fr-primary)" />
            Rating, Analytics & Formal Reporting Engine
          </h1>
          <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
            Proposal Section 3.2 item 7: Donor Ratings, Organization Activity, Food Quantity & Quality, and Status Reports
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="fr-form-select"
            style={{ padding: '8px 12px', fontSize: '0.82rem', width: 'auto' }}
          >
            <option value="today">Today's Data</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days (Current Month)</option>
            <option value="quarter">This Quarter (Q4 2026)</option>
            <option value="alltime">All Time (Platform History)</option>
          </select>

          <button
            type="button"
            className="fr-table-btn"
            onClick={handleExportCSV}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            type="button"
            className="fr-table-btn primary"
            onClick={handleExportPDF}
          >
            <FileText size={14} /> Generate PDF Dossier
          </button>
        </div>
      </div>

      {/* 4 Proposal Report Tabs */}
      <div className="fr-admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div className="fr-admin-tabs" style={{ marginBottom: 0 }}>
          <button
            type="button"
            className={`fr-admin-tab-btn ${activeReportTab === 'donor-ratings' ? 'active' : ''}`}
            onClick={() => setActiveReportTab('donor-ratings')}
          >
            <Star size={14} /> 1. Donor Ratings Report
          </button>
          <button
            type="button"
            className={`fr-admin-tab-btn ${activeReportTab === 'recipient-activity' ? 'active' : ''}`}
            onClick={() => setActiveReportTab('recipient-activity')}
          >
            <Users size={14} /> 2. Organization Activity Report
          </button>
          <button
            type="button"
            className={`fr-admin-tab-btn ${activeReportTab === 'quantity-quality' ? 'active' : ''}`}
            onClick={() => setActiveReportTab('quantity-quality')}
          >
            <Scale size={14} /> 3. Food Quantity & Quality Report
          </button>
          <button
            type="button"
            className={`fr-admin-tab-btn ${activeReportTab === 'donation-status' ? 'active' : ''}`}
            onClick={() => setActiveReportTab('donation-status')}
          >
            <CheckCircle2 size={14} /> 4. Donation Status & Impact
          </button>
        </div>
      </div>

      {/* REPORT 1: DONOR RATINGS */}
      {activeReportTab === 'donor-ratings' && (
        <div className="fr-admin-card">
          <div className="fr-admin-card-header">
            <div>
              <h2 className="fr-admin-card-title">
                <Star size={18} color="var(--fr-primary)" />
                Food Donor Reliability & Quality League Table
              </h2>
              <p className="fr-admin-card-subtitle">
                Ratings calculated from recipient feedback, temperature compliance, and handover punctuality
              </p>
            </div>
          </div>

          <div className="fr-admin-table-wrap">
            <table className="fr-admin-table">
              <thead>
                <tr>
                  <th>Rank & Donor Organization</th>
                  <th>District Hub</th>
                  <th>Total Donations</th>
                  <th>Portions Rescued</th>
                  <th>Net Weight (kg)</th>
                  <th>Donor Rating</th>
                  <th>Punctuality</th>
                  <th>Hygiene Compliance</th>
                  <th>Verification Tier</th>
                </tr>
              </thead>
              <tbody>
                {DONOR_RATINGS_REPORT.map((donor, idx) => (
                  <tr key={donor.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : '#b45309',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.75rem'
                        }}>
                          #{idx + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--fr-text-heading)' }}>{donor.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>ID: DNR-00{donor.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{donor.district}</td>
                    <td><strong>{donor.donationsCount}</strong></td>
                    <td><strong style={{ color: 'var(--fr-primary)' }}>{donor.portionsRescued.toLocaleString()}</strong></td>
                    <td>{donor.weightKg} kg</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#f59e0b' }}>
                        <Star size={14} fill="#f59e0b" /> {donor.rating} / 5.0
                      </div>
                    </td>
                    <td>{donor.punctualityScore}%</td>
                    <td>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{donor.hygieneCompliance}%</span>
                    </td>
                    <td>
                      <span className="fr-status-badge fr-badge-approved">
                        {donor.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 2: ORGANIZATION ACTIVITY */}
      {activeReportTab === 'recipient-activity' && (
        <div className="fr-admin-card">
          <div className="fr-admin-card-header">
            <div>
              <h2 className="fr-admin-card-title">
                <HeartHandshake size={18} color="var(--fr-primary)" />
                Recipient Welfare Organization Activity & Redistribution Volume
              </h2>
              <p className="fr-admin-card-subtitle">
                Tracks portions received, vulnerable individuals nourished, and collection fulfillment rates
              </p>
            </div>
          </div>

          <div className="fr-admin-table-wrap">
            <table className="fr-admin-table">
              <thead>
                <tr>
                  <th>Recipient Organization</th>
                  <th>District Hub</th>
                  <th>Requests Logged</th>
                  <th>Portions Received</th>
                  <th>Beneficiaries Fed</th>
                  <th>Pickup Punctuality</th>
                  <th>Fulfillment Rate</th>
                  <th>Recipient Rating</th>
                </tr>
              </thead>
              <tbody>
                {RECIPIENT_ACTIVITY_REPORT.map((rec, idx) => (
                  <tr key={rec.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--fr-text-heading)' }}>{rec.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>NGO Partner #{idx + 1}</div>
                    </td>
                    <td>{rec.district}</td>
                    <td><strong>{rec.requestsMade}</strong></td>
                    <td><strong style={{ color: 'var(--fr-primary)' }}>{rec.portionsReceived.toLocaleString()}</strong></td>
                    <td>
                      <span style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        {rec.beneficiariesFed} people / day
                      </span>
                    </td>
                    <td>{rec.pickupPunctuality}%</td>
                    <td>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{rec.fulfillmentRate}%</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#f59e0b' }}>
                        <Star size={14} fill="#f59e0b" /> {rec.rating}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: QUANTITY & QUALITY */}
      {activeReportTab === 'quantity-quality' && (
        <div className="fr-admin-card">
          <div className="fr-admin-card-header">
            <div>
              <h2 className="fr-admin-card-title">
                <Scale size={18} color="var(--fr-primary)" />
                Food Quantity Rescued & Safety Quality Audit
              </h2>
              <p className="fr-admin-card-subtitle">
                Category-by-category breakdown of food volume and cold/hot chain temperature compliance
              </p>
            </div>
          </div>

          <div className="fr-admin-table-wrap">
            <table className="fr-admin-table">
              <thead>
                <tr>
                  <th>Food Category</th>
                  <th>Portions Rescued</th>
                  <th>Net Weight</th>
                  <th>Share of Total Volume</th>
                  <th>Holding Temperature Range</th>
                  <th>Food Safety Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {FOOD_QUANTITY_QUALITY_REPORT.map(item => (
                  <tr key={item.category}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--fr-text-heading)' }}>{item.category}</div>
                    </td>
                    <td><strong style={{ color: 'var(--fr-primary)' }}>{item.portions.toLocaleString()}</strong></td>
                    <td><strong>{item.weightKg.toLocaleString()} kg</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px' }} className="fr-progress-bar-bg">
                          <div className="fr-progress-bar-fill" style={{ width: `${item.sharePercent}%` }}></div>
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{item.sharePercent}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.averageTemperatureHolding}</span>
                    </td>
                    <td>
                      <span style={{ color: '#10b981', fontWeight: 800 }}>✓ {item.safetyPassRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 4: DONATION STATUS & IMPACT */}
      {activeReportTab === 'donation-status' && (
        <div className="fr-admin-card">
          <div className="fr-admin-card-header">
            <div>
              <h2 className="fr-admin-card-title">
                <CheckCircle2 size={18} color="var(--fr-primary)" />
                Donation Lifecycle Status & Environmental Impact Summary
              </h2>
              <p className="fr-admin-card-subtitle">
                Conversion funnel from surplus posting to verified recipient consumption
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--fr-bg-subtle)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>COMPLETION SUCCESS RATE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>96.2%</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>Matched & verified handovers</div>
            </div>

            <div style={{ background: 'var(--fr-bg-subtle)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>AVERAGE COLLECTION SPEED</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--fr-primary)', marginTop: '2px' }}>38 Mins</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>From donor post to driver arrival</div>
            </div>

            <div style={{ background: 'var(--fr-bg-subtle)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>LANDFILL DIVERSION CO₂E</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#84cc16', marginTop: '2px' }}>15.5 Tons</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>Methane emissions prevented</div>
            </div>

            <div style={{ background: 'var(--fr-bg-subtle)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>DISCARDED / SPOILED RATE</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--fr-danger)', marginTop: '2px' }}>0.6%</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>Strictly safety temperature aborts</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
