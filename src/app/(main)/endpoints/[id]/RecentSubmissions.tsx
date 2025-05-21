"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function RecentSubmissions({ submissions }: { submissions: any[] | null }) {
    return (
        <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>

            {submissions && submissions.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Row</TableHead>
                                <TableHead>Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map((submission) => (
                                <TableRow key={submission.id}>
                                    <TableCell>{new Date(submission.created_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                                submission.status === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : submission.status === "failed"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                                            {submission.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{submission.sheet_row_number || "-"}</TableCell>
                                    <TableCell>
                                        <ExpandableData data={submission.data} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        No submissions yet. Try submitting a form to this endpoint.
                    </p>
                </div>
            )}
        </div>
    );
}

function ExpandableData({ data }: { data: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <div
                className="cursor-pointer flex items-center gap-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                View Data
                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}/>
            </div>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
            >
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </motion.div>
        </div>
    );
}
