import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, ShoppingBag, RotateCcw, ChevronRight, Download, Calendar } from 'lucide-react';

const AdminDashboard = () => {
    const [timeRange, setTimeRange] = useState('Last 14 Days');

    // Sample data for the chart
    const chartData = [
        { day: 'Wed', earnings: 35, costs: 25 },
        { day: 'Thu', earnings: 42, costs: 30 },
        { day: 'Fri', earnings: 38, costs: 28 },
        { day: 'Sat', earnings: 35, costs: 25 },
        { day: 'Sun', earnings: 60, costs: 45 },
        { day: 'Mon', earnings: 55, costs: 40 },
        { day: 'Tue', earnings: 25, costs: 35 },
        { day: 'Wed', earnings: 35, costs: 30 },
        { day: 'Thu', earnings: 45, costs: 35 },
        { day: 'Fri', earnings: 40, costs: 30 },
        { day: 'Sat', earnings: 50, costs: 40 },
        { day: 'Sun', earnings: 48, costs: 38 },
        { day: 'Mon', earnings: 52, costs: 42 },
        { day: 'Tue', earnings: 55, costs: 45 }
    ];

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
        const maxValue = Math.max(...data.flatMap(d => [d.earnings, d.costs]));
        const chartHeight = 200;
        const chartWidth = 600;

        const getY = (value) => chartHeight - (value / maxValue) * (chartHeight - 40);
        const getX = (index) => (index / (data.length - 1)) * (chartWidth - 80) + 40;

        const earningsPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.earnings)}`).join(' ');
        const costsPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.costs)}`).join(' ');

        return (
            <div className="relative">
                <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="overflow-visible">
                    {/* Grid lines */}
                    {[0, 20, 40, 60].map(value => (
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

                    {/* Earnings line */}
                    <path
                        d={earningsPath}
                        fill="none"
                        stroke="#003554"
                        strokeWidth="2"
                        className="drop-shadow-sm"
                    />

                    {/* Costs line */}
                    <path
                        d={costsPath}
                        fill="none"
                        stroke="#d1d5db"
                        strokeWidth="2"
                        className="drop-shadow-sm"
                    />

                    {/* Data points */}
                    {data.map((d, i) => (
                        <g key={i}>
                            <circle cx={getX(i)} cy={getY(d.earnings)} r="3" fill="#003554" />
                            <circle cx={getX(i)} cy={getY(d.costs)} r="3" fill="#d1d5db" />
                        </g>
                    ))}

                    {/* Y-axis labels */}
                    {[0, 20, 40, 60].map(value => (
                        <text
                            key={value}
                            x="35"
                            y={getY(value) + 4}
                            textAnchor="end"
                            className="text-xs fill-gray-400"
                        >
                            {value}
                        </text>
                    ))}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 px-10 text-xs text-gray-400">
                    {data.map((d, i) => (
                        i % 2 === 0 && <span key={i}>{d.day}</span>
                    ))}
                </div>
            </div>
        );
    };

    const DonutChart = ({ value, total, label }) => {
        const percentage = (value / total) * 100;
        const circumference = 2 * Math.PI * 45;
        const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

        return (
            <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="45"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r="45"
                        stroke="#003554"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold" style={{ color: '#003554' }}>${value}k</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#003554' }}>Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <MetricCard
                        title="Total Sales"
                        subtitle="731 Orders"
                        value="$9,328.55"
                        change="+15.6%"
                        changeValue="+1.4k"
                        icon={ShoppingBag}
                    />
                    <MetricCard
                        title="Visitors"
                        subtitle="Avg time: 4:36m"
                        value="12,302"
                        change="+12.7%"
                        changeValue="+1.2k"
                        icon={Users}
                    />
                    <MetricCard
                        title="Refunds"
                        subtitle="2 Disputed"
                        value="963"
                        change="-12.7%"
                        changeValue="-213"
                        icon={RotateCcw}
                        isNegative={true}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Performance Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                            <h2 className="text-lg font-semibold text-gray-900">Sales Performance</h2>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                    <Download className="w-4 h-4" />
                                    Export data
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                    <Calendar className="w-4 h-4" />
                                    {timeRange}
                                </button>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex gap-6 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#003554' }}></div>
                                <span className="text-sm text-gray-600">Earnings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                <span className="text-sm text-gray-600">Costs</span>
                            </div>
                        </div>

                        <LineChart data={chartData} />
                    </div>

                    {/* Top Categories */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-6" style={{ color: '#003554' }}>Top Categories</h2>

                        <div className="flex justify-center mb-6">
                            <DonutChart value={6.2} total={10} label="Electronics" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#003554' }}></div>
                                    <span className="text-sm font-medium" style={{ color: '#003554' }}>Electronics</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-900">Laptops</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-900">Phones</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile-friendly bottom spacing */}
                <div className="h-8"></div>
            </div>
        </div>
    );
};

export default AdminDashboard;