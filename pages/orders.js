import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        axios.get("/api/orders").then(response => {
            setOrders(response.data);
        });
    }, []);
    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                {orders.length > 0 && orders.map(order => (
                    <tr key={order._id}>
                        <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                        <td className={order.paid ? "text-green-500" : "text-red-500"}>
                            {order.paid ? "YES" : "NO"}
                        </td>
                        <td>
                            {order.name} {order.email}<br />
                            {order.city} {order.postalCode} {order.country}<br />
                            {order.streetAddress}
                        </td>
                        <td key={order._id}>
                            {order.line_items.map((l, index) => (                            
                                <div key={index}>
                                {l.price_data?.product_data?.name} x {l.quantity}
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    );
}

//{JSON.stringify(l)}<br />