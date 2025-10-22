'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function DashboardStats() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const data = [
        { name: "Jan", total: Math.floor(Math.random() * 5000) },
        { name: "Feb", total: Math.floor(Math.random() * 5000) },
        { name: "Mar", total: Math.floor(Math.random() * 5000) },
        { name: "Apr", total: Math.floor(Math.random() * 5000) },
        { name: "May", total: Math.floor(Math.random() * 5000) },
        { name: "Jun", total: Math.floor(Math.random() * 5000) },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Bar
                                dataKey="total"
                                fill="currentColor"
                                radius={[4, 4, 0, 0]}
                                className="fill-primary"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}