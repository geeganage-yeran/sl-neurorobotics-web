import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingBag, RotateCcw, ChevronRight, Download, Calendar } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [timeRange, setTimeRange] = useState('Last 14 Days');
    const [dashboardStats, setDashboardStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await api.get('/admin/dashboard/stats', {
                withCredentials: true
            });
            setDashboardStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setLoading(false);
        }
    };

    const MetricCard = ({ title, value, change, changeValue, icon: Icon, isNegative = false, subtitle }) => (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${title === 'Total Sales' ? 'text-white' : 'text-gray-600'}`} style={{ backgroundColor: title === 'Total Sales' ? '#003554' : '#f3f4f6' }}>
                        <Icon className={`w-5 h-5 ${title === 'Total Sales' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="space-y-2">
                <div className="text-2xl font-bold" style={{ color: '#003554' }}>{value}</div>
                <div className="flex items-center gap-2">
                    {isNegative ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
                        {change}
                    </span>
                    <span className="text-sm text-gray-500">{changeValue} this week</span>
                </div>
            </div>
        </div>
    );

    const LineChart = ({ data }) => {
        if (!data || data.length === 0) return null;

        const maxValue = Math.max(...data.map(d => parseFloat(d.earnings)));
        const chartHeight = 200;
        const chartWidth = 600;

        const getY = (value) => chartHeight - (value / maxValue) * (chartHeight - 40);
        const getX = (index) => (index / (data.length - 1)) * (chartWidth - 80) + 40;

        const earningsPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(parseFloat(d.earnings))}`).join(' ');

        return (
            <div className="relative">
                <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                    {[0, Math.ceil(maxValue * 0.33), Math.ceil(maxValue * 0.66), Math.ceil(maxValue)].map(value => (
                        <line
                            key={value}
                            x1="40"
                            y1={getY(value)}
                            x2={chartWidth - 40}
                            y2={getY(value)}
                            stroke="#f3f4f6"
                            strokeWidth="1"
                        />
                    ))}

                    <path
                        d={earningsPath}
                        fill="none"
                        stroke="#003554"
                        strokeWidth="2"
                        className="drop-shadow-sm"
                    />

                    {data.map((d, i) => (
                        <circle key={i} cx={getX(i)} cy={getY(parseFloat(d.earnings))} r="3" fill="#003554" />
                    ))}

                    {[0, Math.ceil(maxValue * 0.33), Math.ceil(maxValue * 0.66), Math.ceil(maxValue)].map(value => (
                        <text
                            key={value}
                            x="35"
                            y={getY(value) + 4}
                            textAnchor="end"
                            className="text-xs fill-gray-400"
                        >
                            ${value}
                        </text>
                    ))}
                </svg>

                <div className="flex justify-between mt-2 px-10 text-xs text-gray-400">
                    {data.map((d, i) => (
                        i % 2 === 0 && <span key={i}>{d.day}</span>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl font-semibold" style={{ color: '#003554' }}>Loading dashboard...</div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatPercentage = (percent) => {
        const sign = percent >= 0 ? '+' : '';
        return `${sign}${percent.toFixed(1)}%`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#003554' }}>Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <MetricCard
                        title="Total Sales"
                        subtitle={`${formatNumber(dashboardStats?.totalOrderCount || 0)} Orders`}
                        value={formatCurrency(dashboardStats?.totalSalesAmount || 0)}
                        change={formatPercentage(dashboardStats?.salesChangePercentage || 0)}
                        changeValue={dashboardStats?.salesChangeCount >= 0 ? `+${formatCurrency(dashboardStats?.salesChangeCount || 0)}` : formatCurrency(dashboardStats?.salesChangeCount || 0)}
                        icon={ShoppingBag}
                        isNegative={dashboardStats?.salesChangePercentage < 0}
                    />
                    <MetricCard
                        title="Active Users"
                        subtitle={`Avg time: ${dashboardStats?.averageTimeOnSite || '4:36m'}`}
                        value={formatNumber(dashboardStats?.activeUsersCount || 0)}
                        change={formatPercentage(dashboardStats?.activeUsersChangePercentage || 0)}
                        changeValue={dashboardStats?.activeUsersChangeCount >= 0 ? `+${formatNumber(dashboardStats?.activeUsersChangeCount || 0)}` : formatNumber(dashboardStats?.activeUsersChangeCount || 0)}
                        icon={Users}
                        isNegative={dashboardStats?.activeUsersChangePercentage < 0}
                    />
                    {/* <MetricCard
                        title="Refunds"
                        subtitle="Cancelled Orders"
                        value={formatNumber(dashboardStats?.refundCount || 0)}
                        change={formatPercentage(dashboardStats?.refundChangePercentage || 0)}
                        changeValue={dashboardStats?.refundChangeCount >= 0 ? `+${formatNumber(dashboardStats?.refundChangeCount || 0)}` : formatNumber(dashboardStats?.refundChangeCount || 0)}
                        icon={RotateCcw}
                        isNegative={dashboardStats?.refundChangePercentage >= 0}
                    /> */}
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                            <h2 className="text-lg font-semibold text-gray-900">Earnings Overview</h2>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                    <Calendar className="w-4 h-4" />
                                    {timeRange}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-6 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#003554' }}></div>
                                <span className="text-sm text-gray-600">Earnings</span>
                            </div>
                        </div>

                        <LineChart data={dashboardStats?.earningsOverview || []} />
                    </div>
                </div>

                <div className="h-8"></div>
            </div>
        </div>
    );
};

export default AdminDashboard;