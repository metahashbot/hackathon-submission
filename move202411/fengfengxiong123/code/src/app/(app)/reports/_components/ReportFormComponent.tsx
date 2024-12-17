import React, { useState } from 'react';
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useWallet } from '@suiet/wallet-kit';
import { Transaction } from '@mysten/sui/transactions';

export function FormComponent() {
    const [formData, setFormData] = useState({
        nameInput: '',
        timeInput: new Date(),
        wbcInput: '',
        rbcInput: '',
        pltInput: '',
        cInput: '',
    });

    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { account, status, signAndExecuteTransaction } = useWallet();
    console.log('status', status)

    const tx = new Transaction();

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData((preData) => ({
            ...preData,
            [name]: value
        }));
    };

    const handleTimeChange = (date:any) => {
        setFormData((prevData) => ({
            ...prevData,
            timeInput: date
        }));
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");
        const { nameInput, wbcInput, rbcInput, pltInput, cInput, timeInput } = formData;
        const report_name = nameInput;
        const report_wbc = wbcInput;
        const report_rbc = rbcInput;
        const report_pla = pltInput;
        const report_crp = cInput;
        const report_date = timeInput.getTime() * 1000;

        if (account) {
            try {
                const data = tx.moveCall({
                    target: '0x1be961232f8682cb89f2d6b487f790a2e979d051f6cdb5a2d274b0cbe0d82608::hcsc_v4::create_lab_report',
                    arguments: [
                        tx.pure.string(report_name),
                        tx.pure.u64(report_wbc),
                        tx.pure.u64(report_rbc),
                        tx.pure.u64(report_pla),
                        tx.pure.u64(report_crp),
                        tx.pure.u64(report_date),
                        tx.object('0x66f2ce8d058b1cabbaaebeb19593dcddef850f37b3a232dcb462498f1445c35f')
                    ],
                });
                const response = await signAndExecuteTransaction({ transaction: tx });
                setMessage("报告提交成功！");
                setFormData({
                    nameInput: '',
                    timeInput: new Date(),
                    wbcInput: '',
                    rbcInput: '',
                    pltInput: '',
                    cInput: '',
                });
            } catch (error) {
                setMessage("报告提交失败，请稍后再试。");
            }
        } else {
            setMessage("请先连接钱包后再尝试提交报告。");
        }
        setIsSubmitting(false);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="text-center text-2xl font-bold text-blue-600 mb-6">报告上链</h2>

            <Card className="bg-white shadow-xl rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    {/* Report Name Input */}
                    <div className="mb-4">
                        <label htmlFor="nameInput" className="block text-sm font-medium text-gray-700">报告名:</label>
                        <input
                            type="text"
                            id="nameInput"
                            name="nameInput"
                            value={formData.nameInput}
                            onChange={handleChange}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Report Date Input */}
                    <div className="mb-4">
                        <label htmlFor="timeInput" className="block text-sm font-medium text-gray-700">报告生成日期:</label>
                        <DatePicker
                            selected={formData.timeInput}
                            onChange={handleTimeChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy年MM月dd日 HH:mm"
                            className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* WBC Input */}
                    <div className="mb-4">
                        <label htmlFor="wbcInput" className="block text-sm font-medium text-gray-700">白细胞计数:</label>
                        <input
                            type="number"
                            id="wbcInput"
                            name="wbcInput"
                            value={formData.wbcInput}
                            onChange={handleChange}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            step="any"
                        />
                    </div>

                    {/* RBC Input */}
                    <div className="mb-4">
                        <label htmlFor="rbcInput" className="block text-sm font-medium text-gray-700">红细胞计数:</label>
                        <input
                            type="number"
                            id="rbcInput"
                            name="rbcInput"
                            value={formData.rbcInput}
                            onChange={handleChange}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            step="any"
                        />
                    </div>

                    {/* PLT Input */}
                    <div className="mb-4">
                        <label htmlFor="pltInput" className="block text-sm font-medium text-gray-700">血小板计数:</label>
                        <input
                            type="number"
                            id="pltInput"
                            name="pltInput"
                            value={formData.pltInput}
                            onChange={handleChange}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            step="any"
                        />
                    </div>

                    {/* CRP Input */}
                    <div className="mb-4">
                        <label htmlFor="cInput" className="block text-sm font-medium text-gray-700">c反应蛋白:</label>
                        <input
                            type="number"
                            id="cInput"
                            name="cInput"
                            value={formData.cInput}
                            onChange={handleChange}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            step="any"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <Button
                            variant="secondary"
                            className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '提交中...' : '确认'}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Feedback Message */}
            {message && (
                <Card className={`mt-4 p-4 text-center ${message.includes('成功') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <p>{message}</p>
                </Card>
            )}
        </div>
    );
}
