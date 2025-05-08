import { useState, useEffect } from "react";
import SideBar from "@/components/Sidebar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  PlusSquare,
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart,
  Calendar,
  Wallet,
  TrendingUp,
  Loader2,
  Edit,
  Trash2,
  FileX,
  Save,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import axios from "axios";
import {
  SubCategory,
  Transaction,
  BudgetType,
  BudgetDetail,
} from "@/lib/types";
import { toast } from "sonner";
import { typeMap } from '@/lib/helper';

interface BudgetProps {
  categories: SubCategory[];
}

const Budget = ({ categories }: BudgetProps) => {
  const now = new Date();
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [budgetDetails, setBudgetDetails] = useState<BudgetDetail[]>([]);

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [transactionsOpen, setTransactionsOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>();
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [newCat, setNewCat] = useState<string>("");
  const [newBudgetAmt, setNewBudgetAmt] = useState<number>(0);
  const [editId, setEditId] = useState<string | null>(null);
  const [editAmt, setEditAmt] = useState<number>(0);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/budget?month=${month}&year=${year}`, {
        withCredentials: true,
      });
      let budgetList: BudgetType[] = res.data;
  
      // Lọc theo tháng và năm
      budgetList = budgetList.filter((b) => {
        const date = new Date(b.createdTime);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });
  
      setBudgets(budgetList);
  
      // Lấy chi tiết
      const detailResponses = await Promise.all(
        budgetList.map((b) =>
          axios.get(`http://localhost:3000/budget/${b._id}`, {
            withCredentials: true,
          })
        )
      );
      const details: BudgetDetail[] = detailResponses.map((r) => r.data);
      console.log(details);
      
      setBudgetDetails(details);
    } catch (error) {
      toast.error("Không tải được ngân sách hoặc chi tiết!");
    } finally {
      setLoading(false);
    }
  };
  
  // fetch detail budget
  useEffect(() => {
    // const fetchBudgetsAndDetails = async () => {
    //   setLoading(true);
    //   try {
    //     const res = await axios.get("http://localhost:3000/budget", {
    //       withCredentials: true,
    //     });
    //     let budgetList: BudgetType[] = res.data;
    //     console.log(res.data);
        

    //     budgetList = budgetList.filter((b) => {
    //       const date = new Date(b.createdTime);
    //       console.log(date, month, year);
          
    //       return date.getMonth() + 1 === month && date.getFullYear() === year;
    //     });
    //     setBudgets(budgetList);

    //     // fetch chi tiết từng budget song song
    //     const detailResponses = await Promise.all(
    //       budgetList.map((b) =>
    //         axios.get(`http://localhost:3000/budget/${b._id}`, {
    //           withCredentials: true,
    //         })
    //       )
    //     );

    //     const details: BudgetDetail[] = detailResponses.map((r) => r.data);
    //     setBudgetDetails(details);
    //     console.log("Chi tiết ngân sách:", details);
    //   } catch (error) {
    //     toast.error("Không tải được ngân sách hoặc chi tiết!");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchBudgetsAndDetails();
    fetchBudgets()
  }, [month, year]);

  // Handlers
  const handleOpenTransactions = (id: string) => {
    setSelectedBudgetId(id);
    setTransactionList(
      budgetDetails.find((b) => b.budget._id === id)?.transactions || []
    );
    setTransactionsOpen(true);
  };

  const handleAddBudget = async () => {
    try {
      if (!newCat || newBudgetAmt <= 0) {
        toast.error("Vui lòng chọn danh mục và nhập số tiền hợp lệ!");
        return;
      }

      const res = await axios.post(
        "http://localhost:3000/budget/create",
        { categoryID: newCat, budget: String(newBudgetAmt) },
        { withCredentials: true }
      );

      if (res.data.message === 'Ngân sách cho danh mục này đã tồn tại') {
        toast.error("Ngân sách cho danh mục này đã tồn tại!");
        return;
      }

      console.log(res);
      
      toast.success("Tạo ngân sách thành công!");
      setAddOpen(false);
      setNewCat("");
      setNewBudgetAmt(0);
      await fetchBudgets();

      // // Refetch budgets và details
      // const res = await axios.get("http://localhost:3000/budget", {
      //   withCredentials: true,
      // });
      // const budgetList: BudgetType[] = res.data;
      // setBudgets(budgetList);

      // const detailResponses = await Promise.all(
      //   budgetList.map((b) =>
      //     axios.get(`http://localhost:3000/budget/${b._id}`, {
      //       withCredentials: true,
      //     })
      //   )
      // );
      // const details: BudgetDetail[] = detailResponses.map((r) => r.data);
      // setBudgetDetails(details);
    } catch (error) {
      toast.error("Tạo ngân sách thất bại!");
    }
  };

  const handleEdit = async () => {
    if (!editId) return;
  
    try {
      await axios.put(
        "http://localhost:3000/budget/update",
        { id: editId, budget: String(editAmt) },
        { withCredentials: true }
      );
  
      toast.success("Cập nhật thành công!");
      setEditId(null);
      setEditAmt(0);
  
      // const res = await axios.get("http://localhost:3000/budget", {
      //   withCredentials: true,
      // });
      // const budgetList: BudgetType[] = res.data;
      // setBudgets(budgetList);
  
      // const detailResponses = await Promise.all(
      //   budgetList.map((b) =>
      //     axios.get(`http://localhost:3000/budget/${b._id}`, {
      //       withCredentials: true,
      //     })
      //   )
      // );
      // const details: BudgetDetail[] = detailResponses.map((r) => r.data);
      // setBudgetDetails(details);
      await fetchBudgets();
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };
  

  const handleDelete = async (id: string) => {
    console.log("deleting", id);
    if(confirm("Bạn có chắc chắn muốn xóa ngân sách này không?"))
      
    try {
      await axios.delete(`http://localhost:3000/budget/delete/${id}`, {
        withCredentials: true,
      });
  
      toast.success("Xóa thành công!");
  
      // const res = await axios.get("http://localhost:3000/budget", {
      //   withCredentials: true,
      // });
      // const budgetList: BudgetType[] = res.data;
      // setBudgets(budgetList);
  
      // const detailResponses = await Promise.all(
      //   budgetList.map((b) =>
      //     axios.get(`http://localhost:3000/budget/${b._id}`, {
      //       withCredentials: true,
      //     })
      //   )
      // );
      // const details: BudgetDetail[] = detailResponses.map((r) => r.data);
      // setBudgetDetails(details);
      await fetchBudgets();
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-blue-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  

  return (
    <div className="flex w-screen min-h-screen bg-blue-50">
      <div className="flex-1">
        <SideBar />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-4 p-6 overflow-auto"
      >
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border rounded p-1"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border rounded p-1"
            >
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <div className="flex items-center gap-2 text-gray-800">
            <PlusSquare /> <span>Thêm ngân sách</span>
            </div>
          </Button>
        </header>

        <Tabs defaultValue="expenses">
          <TabsList className="mb-4">
            <TabsTrigger value="expenses">
              <ArrowDownCircle /> Tổng quan
            </TabsTrigger>
            {/* <TabsTrigger value="overview">
              <PieChart /> Tổng quan
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="expenses" className="grid gap-4 sm:grid-cols-2">
            {budgetDetails.map((b) => {
              const percentUsed =
                ((Number(b.budget.budget) - b.remaining) /
                  Number(b.budget.budget)) *
                100;
              const warn = b.remaining / Number(b.budget.budget) <= 0.1;
              console.log(warn);
              
              // console.log(b.budget);
              
              
              return (
                
                <Card
                  key={b.budget._id}
                  onClick={() =>
                    handleOpenTransactions(b.budget._id)
                  }
                >
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>
                      {categories.find(
                        (item) => item._id === b.budget.categoryID
                      )?.name || "Không rõ danh mục"}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Edit
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditId(b.budget._id);
                          setEditAmt(Number(b.budget.budget));
                        }}
                        className="cursor-pointer"
                      />
                      <Trash2
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(b.budget._id);
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      {(Number(b.budget.budget) - b.remaining).toLocaleString()}{" "}
                      VND / {Number(b.budget.budget).toLocaleString()} VND
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mt-2">
                      <div
                        className={`h-full ${warn ? "bg-red-500" : "bg-green-500"}`}
                        style={{ width: `${percentUsed}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>
                  <TrendingUp /> Tổng quan
                </CardTitle>
                <CardDescription>
                  Ngân sách tháng {month}/{year}
                </CardDescription>
              </CardHeader>
              <CardContent>{/* Add overview content here */}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Budget Dialog */}
<Dialog open={addOpen} onOpenChange={setAddOpen}>
  <DialogContent className="max-w-md w-full">
    <DialogHeader className="mb-4">
      <DialogTitle className="text-xl font-semibold">Thêm ngân sách mới</DialogTitle>
      <DialogDescription className="text-base text-muted-foreground">
        Chọn danh mục và nhập số tiền ngân sách
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Danh mục
        </label>
        <div className="relative">
          <select
            id="category"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="appearance-none w-full border rounded-md py-3 px-4 bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          >
            <option value="">-- Chọn danh mục --</option>
            {(categories.filter((c) => typeMap[c.name] === "Chi tiêu")).map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-5 top-4 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Số tiền
        </label>
        <div className="relative">
          <input
            id="amount"
            type="number"
            value={newBudgetAmt === 0 ? "" : newBudgetAmt}
            onChange={(e) => setNewBudgetAmt(Number(e.target.value))}
            className="no-spinner w-full border rounded-md py-3 px-4 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            placeholder="Nhập số tiền ngân sách"
          />
          <span className="absolute right-3 top-3 text-muted-foreground pointer-events-none">
            VND
          </span>
        </div>
      </div>
    </div>

    <DialogFooter className="mt-6 gap-3">
      <DialogClose asChild>
        <Button variant="outline" className="font-medium min-w-24">Hủy</Button>
      </DialogClose>
      <Button 
        onClick={handleAddBudget} 
        className="font-medium min-w-24"
        disabled={!newCat || !newBudgetAmt}
      >
        <Plus className="h-4 w-4 mr-2 text-gray-800" />
        <span className="text-gray-800">Tạo</span>
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* Edit Budget Dialog */}
<Dialog open={!!editId} onOpenChange={() => setEditId(null)}>
  <DialogContent className="max-w-md w-full">
    <DialogHeader className="mb-4">
      <DialogTitle className="text-xl font-semibold">Cập nhật ngân sách</DialogTitle>
      <DialogDescription className="text-base text-muted-foreground">
        Điều chỉnh số tiền ngân sách
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-2">
      <label htmlFor="edit-amount" className="text-sm font-medium">
        Số tiền mới
      </label>
      <div className="relative">
        <input
          id="edit-amount"
          type="number"
          value={editAmt === 0 ? "" : editAmt}
          onChange={(e) => setEditAmt(Number(e.target.value))}
          className="no-spinner w-full border rounded-md py-3 px-4 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          placeholder="Nhập số tiền mới"
        />
        <span className="absolute right-3 top-3 text-muted-foreground pointer-events-none">
          VND
        </span>
      </div>
    </div>

    <DialogFooter className="mt-6 gap-3">
      <DialogClose asChild>
        <Button variant="outline" className="font-medium min-w-24">Hủy</Button>
      </DialogClose>
      <Button 
        onClick={handleEdit} 
        className="font-medium min-w-24"
        disabled={!editAmt}
      >
        <span className="flex items-center text-gray-800">
          <Save className="h-4 w-4 mr-2" />
          Lưu
        </span>
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


{/* Transactions Dialog */}
<Dialog open={transactionsOpen} onOpenChange={setTransactionsOpen}>
  <DialogContent className="max-w-md w-full">
    <DialogHeader className="mb-4">
      <DialogTitle className="text-xl font-semibold">Giao dịch chi tiết</DialogTitle>
      <DialogDescription className="text-base text-muted-foreground">
        Danh sách các giao dịch gần đây
      </DialogDescription>
    </DialogHeader>

    {transactionList.length > 0 ? (
      <div className="space-y-3 max-h-80 overflow-auto pr-2">
        {transactionList.map((t) => (
          <div key={t._id} className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium flex items-center text-gray-800">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {format(new Date(t.datetime), "dd/MM/yyyy", { locale: vi })}
              </span>
              <span className="text-base font-semibold text-primary">
                {Number(t.money).toLocaleString()} VND
              </span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t.description || "Không có mô tả"}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-8 text-center text-muted-foreground">
        <FileX className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Không có giao dịch nào</p>
      </div>
    )}

    <DialogFooter className="mt-4">
      <DialogClose asChild>
        <Button className="font-medium min-w-24">
          <span className="flex items-center text-gray-800">
            Đóng
          </span>
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>

      </motion.div>
    </div>
  );
};

export default Budget;
