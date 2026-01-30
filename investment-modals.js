// 投資追蹤模態框功能
// 為增強投資追蹤系統添加用戶界面

// 顯示投資分析模態框
function showInvestmentAnalysisModal() {
    const analysis = getEnhancedPortfolioAnalysis();
    const stats = getInvestmentStatistics();
    
    if (!analysis) {
        alert('尚無投資數據可分析');
        return;
    }
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px;">📈 投資分析報告</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">投資組合價值</div>
                    <div style="font-size: 20px; font-weight: 600; color: #1f2937;">NT$ ${analysis.summary.totalValue.toLocaleString()}</div>
                </div>
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">總損益</div>
                    <div style="font-size: 20px; font-weight: 600; color: ${analysis.summary.totalPnL >= 0 ? '#10b981' : '#ef4444'};">
                        NT$ ${analysis.summary.totalPnL.toLocaleString()}
                    </div>
                </div>
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">損益百分比</div>
                    <div style="font-size: 20px; font-weight: 600; color: ${analysis.summary.totalPnLPercent >= 0 ? '#10b981' : '#ef4444'};">
                        ${analysis.summary.totalPnLPercent.toFixed(2)}%
                    </div>
                </div>
                <div style="padding: 16px; background: #f9fafb; border-radius: 8px;">
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">股利收入</div>
                    <div style="font-size: 20px; font-weight: 600; color: #1f2937;">NT$ ${analysis.summary.totalDividend.toLocaleString()}</div>
                </div>
            </div>
            
            ${analysis.recommendations && analysis.recommendations.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px;">💡 投資建議</h3>
                    ${analysis.recommendations.map(rec => `
                        <div style="padding: 12px; border-left: 4px solid ${
                            rec.priority === 'high' ? '#ef4444' :
                            rec.priority === 'medium' ? '#f59e0b' : '#10b981'
                        }; background: #f9fafb; border-radius: 4px; margin-bottom: 8px;">
                            <div style="font-weight: 600; color: #1f2937; margin-bottom: 4px;">${rec.title}</div>
                            <div style="color: #6b7280; font-size: 14px; margin-bottom: 4px;">${rec.description}</div>
                            <div style="color: #374151; font-size: 13px; font-style: italic;">建議：${rec.action}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button onclick="this.closest('div[style*=fixed]').remove()" style="padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 6px; background: white; color: #374151; cursor: pointer;">關閉</button>
                <button onclick="exportInvestmentReport()" style="padding: 8px 16px; border: none; border-radius: 6px; background: #667eea; color: white; cursor: pointer;">匯出報告</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// 顯示投資歷史模態框
function showInvestmentHistoryModal() {
    const history = getInvestmentHistory();
    
    if (history.length === 0) {
        alert('尚無投資記錄');
        return;
    }
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 24px; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px;">📋 投資歷史記錄</h2>
            
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f9fafb;">
                            <th style="padding: 8px; text-align: left; font-size: 12px; color: #6b7280;">日期</th>
                            <th style="padding: 8px; text-align: left; font-size: 12px; color: #6b7280;">類型</th>
                            <th style="padding: 8px; text-align: left; font-size: 12px; color: #6b7280;">股票</th>
                            <th style="padding: 8px; text-align: right; font-size: 12px; color: #6b7280;">價格</th>
                            <th style="padding: 8px; text-align: right; font-size: 12px; color: #6b7280;">數量</th>
                            <th style="padding: 8px; text-align: right; font-size: 12px; color: #6b7280;">金額</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${history.slice(0, 50).map(record => `
                            <tr style="border-bottom: 1px solid #f3f4f6;">
                                <td style="padding: 8px; font-size: 14px;">${record.date}</td>
                                <td style="padding: 8px; font-size: 14px;">
                                    <span style="padding: 2px 6px; border-radius: 4px; font-size: 12px; color: white; background: ${
                                        record.type === 'buy' ? '#10b981' :
                                        record.type === 'sell' ? '#ef4444' : '#3b82f6'
                                    };">${record.type === 'buy' ? '買入' : record.type === 'sell' ? '賣出' : '股利'}</span>
                                </td>
                                <td style="padding: 8px; font-size: 14px;">${record.stockName || record.stockCode}</td>
                                <td style="padding: 8px; text-align: right; font-size: 14px;">NT$ ${record.price?.toFixed(2) || '-'}</td>
                                <td style="padding: 8px; text-align: right; font-size: 14px;">${record.shares?.toLocaleString() || '-'}</td>
                                <td style="padding: 8px; text-align: right; font-size: 14px;">NT$ ${((record.price || 0) * (record.shares || 0)).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${history.length > 50 ? `<p style="text-align: center; color: #6b7280; margin-top: 12px; font-size: 14px;">顯示最近 50 筆記錄，共 ${history.length} 筆</p>` : ''}
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
                <button onclick="this.closest('div[style*=fixed]').remove()" style="padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 6px; background: white; color: #374151; cursor: pointer;">關閉</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// 匯出投資報告
function exportInvestmentReport() {
    const analysis = getEnhancedPortfolioAnalysis();
    const stats = getInvestmentStatistics();
    
    const report = {
        generatedAt: new Date().toISOString(),
        summary: analysis.summary,
        statistics: stats,
        portfolio: investmentTracker.portfolio,
        recommendations: analysis.recommendations,
        targets: getInvestmentTargets()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investment-analysis-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// 導出函數供全域使用
window.showInvestmentAnalysisModal = showInvestmentAnalysisModal;
window.showInvestmentHistoryModal = showInvestmentHistoryModal;
window.exportInvestmentReport = exportInvestmentReport;
