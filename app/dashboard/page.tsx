"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Record {
  id: number;
  user_id: number;
  phone: string;
  sex: string;
  name: string;
  city: string;
  question: string;
  results: string;
  description: string;
  last_modified: string;
  day_pasted: number;
}

export default function Dashboard() {
  const [records, setRecords] = useState<Record[]>([]);
  const [editingCell, setEditingCell] = useState<{
    id: number;
    field: keyof Record;
  } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const res = await fetch("/api/records", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      } else {
        throw new Error("Failed to fetch records");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch records",
        variant: "destructive",
      });
    }
  };

  const handleCellEdit = async (
    id: number,
    field: keyof Record,
    value: string | number
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/records", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, [field]: value }),
      });

      if (res.ok) {
        setRecords((prev) =>
          prev.map((record) =>
            record.id === id ? { ...record, [field]: value } : record
          )
        );
        setEditingCell(null);
      } else {
        throw new Error("Failed to update record");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update record",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Records Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Results</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Days Passed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                {Object.keys(record)
                  .filter((key) => key !== "id" && key !== "user_id")
                  .map((key) => (
                    <TableCell
                      key={key}
                      onClick={() =>
                        setEditingCell({
                          id: record.id,
                          field: key as keyof Record,
                        })
                      }
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      {editingCell?.id === record.id &&
                      editingCell?.field === key ? (
                        <Input
                          autoFocus
                          defaultValue={record[key as keyof Record]}
                          onBlur={(e) =>
                            handleCellEdit(
                              record.id,
                              key as keyof Record,
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCellEdit(
                                record.id,
                                key as keyof Record,
                                e.currentTarget.value
                              );
                            }
                          }}
                        />
                      ) : (
                        record[key as keyof Record]
                      )}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}