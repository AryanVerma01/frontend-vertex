"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { BarChart3, Activity, DollarSign, Calendar, TrendingUp } from 'lucide-react';

type StatementKey = 'INC' | 'BAL' | 'CAS';
interface MetricItem { displayName: string; key: string; value: string; qoQComp: unknown; yqoQComp: unknown }
interface FinancialYear { stockFinancialMap: Record<StatementKey, MetricItem[]>; FiscalYear: string; EndDate: string; Type: string }
interface FinancialData { financials: FinancialYear[] }
type ChartRow = { year: string; endDate: string } & { [key: string]: number | string };

// Props interface
interface DynamicFinancialChartsProps {
  data?: FinancialData;
}

const DynamicFinancialCharts: React.FC<DynamicFinancialChartsProps> = ({ 
  data
}) => {
  const [selectedStatement, setSelectedStatement] = useState<StatementKey>('INC');
  const [selectedMetrics, setSelectedMetrics] = useState(['TotalRevenue', 'NetIncome']);
  const [chartType, setChartType] = useState('line');

  // Update selected metrics when statement changes or data changes
  useEffect(() => {
    const effective = data || sampleData;
    if (effective?.financials?.length) {
      const availableMetrics = getAvailableMetrics(selectedStatement);
      if (availableMetrics.length > 0) {
        // Keep existing metrics that are still available, or use first available metric
        const validMetrics = selectedMetrics.filter(metric => 
          availableMetrics.some(available => available.key === metric)
        );
        if (validMetrics.length === 0) {
          setSelectedMetrics([availableMetrics[0].key]);
        } else {
          setSelectedMetrics(validMetrics);
        }
      }
    }
  }, [data, selectedStatement]);

  // Transform data for charts
  const transformDataForChart = (
    data: FinancialData,
    statement: StatementKey,
    metrics: string[],
  ): ChartRow[] => {
    if (!data?.financials) return [];

    return data.financials
      .map((yearData) => {
        const statementData = yearData.stockFinancialMap[statement] || [];
        const result: ChartRow = {
          year: yearData.FiscalYear,
          endDate: yearData.EndDate,
        };

        metrics.forEach((metricKey) => {
          const metric = statementData.find((item) => item.key === metricKey);
          result[metricKey] = metric ? parseFloat(metric.value) / 1000 : 0; // Convert to thousands
        });

        return result;
      })
      .reverse(); // Reverse to show chronological order
  };

  // Get available metrics for selected statement
  const getAvailableMetrics = (statement: StatementKey) => {
    const effective = data || sampleData;
    if (!effective?.financials?.[0]?.stockFinancialMap?.[statement]) return [];

    return effective.financials[0].stockFinancialMap[statement].map((item) => ({
      key: item.key,
      displayName: item.displayName,
    }));
  };

  // Format numbers for display
  const formatValue = (value: number) => {
    if (!value && value !== 0) return '$0K';
    if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}B`;
    if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}M`;
    return `$${value.toFixed(1)}K`;
  };

  // Sample data for demonstration
  const sampleData: FinancialData = {
    financials: [
      {
        stockFinancialMap: {
          CAS: [
            { displayName: "Issuance( Retirement)of Debt Net ", key: "Issuance(Retirement)ofDebtNet", value: "5324.95", qoQComp: null, yqoQComp: null },
            { displayName: "Net Changein Cash ", key: "NetChangeinCash", value: "2524.12", qoQComp: null, yqoQComp: null },
            { displayName: "Cashfrom Operating Activities ", key: "CashfromOperatingActivities", value: "23511.81", qoQComp: null, yqoQComp: null },
            { displayName: "Cashfrom Financing Activities ", key: "CashfromFinancingActivities", value: "-7002.44", qoQComp: null, yqoQComp: null },
            { displayName: "Capital Expenditures ", key: "CapitalExpenditures", value: "-15670.52", qoQComp: null, yqoQComp: null }
          ],
          BAL: [
            { displayName: "Total Assets ", key: "TotalAssets", value: "279394.80", qoQComp: null, yqoQComp: null },
            { displayName: "Cash ", key: "Cash", value: "9604.96", qoQComp: null, yqoQComp: null },
            { displayName: "Total Equity ", key: "TotalEquity", value: "91169.63", qoQComp: null, yqoQComp: null },
            { displayName: "Total Liabilities ", key: "TotalLiabilities", value: "188225.17", qoQComp: null, yqoQComp: null },
            { displayName: "Total Debt ", key: "TotalDebt", value: "94801.05", qoQComp: null, yqoQComp: null }
          ],
          INC: [
            { displayName: "Total Revenue ", key: "TotalRevenue", value: "218542.51", qoQComp: null, yqoQComp: null },
            { displayName: "Net Income ", key: "NetIncome", value: "3420.51", qoQComp: null, yqoQComp: null },
            { displayName: "Operating Income ", key: "OperatingIncome", value: "14363.36", qoQComp: null, yqoQComp: null },
            { displayName: "Gross Profit ", key: "GrossProfit", value: "94098.07", qoQComp: null, yqoQComp: null },
            { displayName: "Costof Revenue Total ", key: "CostofRevenueTotal", value: "124444.44", qoQComp: null, yqoQComp: null }
          ]
        },
        FiscalYear: "2025",
        EndDate: "2025-03-31",
        Type: "Annual"
      }
    ]
  };

  // Custom tooltip
  const CustomTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`Year: ${label}`}</p>
          {payload.map((entry, index) => {
            const metric = getAvailableMetrics(selectedStatement).find((m) => m.key === entry.dataKey);
            return (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {metric?.displayName || entry.dataKey}: {formatValue((entry.value as number) * 1000)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const chartData = transformDataForChart((data || sampleData), selectedStatement, selectedMetrics);

  const StatementTabs = () => (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {([
        { key: 'INC', label: 'Income Statement', icon: TrendingUp },
        { key: 'BAL', label: 'Balance Sheet', icon: BarChart3 },
        { key: 'CAS', label: 'Cash Flow', icon: DollarSign }
      ] as Array<{ key: StatementKey; label: string; icon: React.ComponentType<{ size?: number }> }>).map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => {
            setSelectedStatement(key);
            const availableMetrics = getAvailableMetrics(key);
            if (availableMetrics.length > 0) {
              setSelectedMetrics([availableMetrics[0].key]);
            }
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
            selectedStatement === key
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{key}</span>
        </button>
      ))}
    </div>
  );

  const MetricSelector = () => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Select Metrics to Display</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
        {getAvailableMetrics(selectedStatement).map(metric => (
          <label key={metric.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedMetrics.includes(metric.key)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedMetrics([...selectedMetrics, metric.key]);
                } else {
                  setSelectedMetrics(selectedMetrics.filter(m => m !== metric.key));
                }
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 truncate">{metric.displayName}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const ChartTypeSelector = () => (
    <div className="flex space-x-2">
      {[
        { type: 'line', label: 'Line', icon: Activity },
        { type: 'bar', label: 'Bar', icon: BarChart3 },
        { type: 'area', label: 'Area', icon: TrendingUp }
      ].map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          onClick={() => setChartType(type)}
          className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
            chartType === type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Icon size={14} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );

  const renderChart = () => {
    if (!chartData.length || !selectedMetrics.length) {
      return (
        <div className="h-96 flex items-center justify-center text-gray-500">
          {'No data available for selected metrics'}
        </div>
      );
    }

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="year" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          {selectedMetrics.map((metric, index) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
            />
          ))}
        </LineChart>
      );
    }

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="year" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          {selectedMetrics.map((metric, index) => (
            <Bar
              key={metric}
              dataKey={metric}
              fill={colors[index % colors.length]}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      );
    }

    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="year" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          {selectedMetrics.map((metric, index) => (
            <Area
              key={metric}
              type="monotone"
              dataKey={metric}
              stackId="1"
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.3}
            />
          ))}
        </AreaChart>
      );
    }

    return <></>;
  };

  // duplicate sampleData removed

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Data Visualization</h1>
              <p className="text-gray-600 mt-1">Interactive charts for comprehensive financial analysis</p>
            </div>
            {!data && (
              <div className="text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                Using sample data for demonstration
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Financial Statement</h3>
              <StatementTabs />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Chart Type</h3>
              <ChartTypeSelector />
            </div>
            <div>
              <MetricSelector />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedStatement === 'INC' && 'Income Statement Analysis'}
              {selectedStatement === 'BAL' && 'Balance Sheet Analysis'}
              {selectedStatement === 'CAS' && 'Cash Flow Analysis'}
            </h2>
            {selectedMetrics.length > 0 && chartData.length > 0 && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Showing {selectedMetrics.length} metric{selectedMetrics.length > 1 ? 's' : ''}</span>
                <span>•</span>
                <span>{chartData.length} years</span>
              </div>
            )}
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        {selectedMetrics.length > 1 && chartData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedMetrics.map((metric, index) => {
                const metricInfo = getAvailableMetrics(selectedStatement).find(m => m.key === metric);
                const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
                return (
                  <div key={metric} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm text-gray-700">{metricInfo?.displayName || metric}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicFinancialCharts;