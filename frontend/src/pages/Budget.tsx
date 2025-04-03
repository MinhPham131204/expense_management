import { useState, useEffect } from "react";
import SideBar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PlusSquare, ArrowUpCircle, ArrowDownCircle, PieChart, Calendar, DollarSign, Wallet, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import axios from "axios";
import { SubCategory, Transaction, Category } from "@/lib/types";
import { toast } from "sonner";
// interface Category {
//   _id: string;
//   name: string;
//   subCategory: SubCategory[];
// }


const Budget = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  
  // Set the date format to "MM/yyyy" for Vietnamese locale
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "MM/yyyy", { locale: vi })
  );

  const [budget, setBudget] = useState([])
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState<SubCategory[]>([])
  const [parentCategories, setParentCategories] = useState<Category[]>([])


  useEffect(() => {
    const fetchBudget = async () => {
      try {
        console.log("Fetching budget...");
        const response = await axios.get("http://localhost:3000/budget", { withCredentials: true });
        console.log("Budget response:", response);
        setBudget(response.data);
      } catch (error) {
        console.error("Error fetching budget:", error);
      }
    };
    fetchBudget();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/transaction/allInMonth?month=4&year=2025", { withCredentials: true });
        setTransactions(response.data.transactions);
        console.log("Transactions response:", response);
        
      } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      };
      fetchTransactions();
    }, []);
  

    // console.log(budget);


    useEffect(() => {
      const fetchCategories = async () => {
        try {
          let response = await axios.get("http://localhost:3000/category/expense", { withCredentials: true });
          let { data } = response
          response = await axios.get("http://localhost:3000/category/income", { withCredentials: true });
          data = data.concat(response.data)
          setParentCategories(data) 
          console.log("Categories response:", response);
        } catch (error) {
          console.error("Error fetching categories:", error);
          toast.warning("Không thể tải danh mục!");
        }
      };
  
      fetchCategories();
    }, []);

    useEffect(() => {
        if (parentCategories.length > 0) {
          setCategories(
            parentCategories.flatMap((category: Category) =>
              category.subCategory
            )
          );
        }
      }, [parentCategories]);
    
  
  // Sample budget data
  const budgetData = {
    income: 5200000,
    expenses: 3750000,
    remaining: 1450000,
    categories: [
      { name: "Tiền thuê nhà", budget: 1500000, spent: 0, icon: "🏠", type: "expense" },
      { name: "Ăn uống", budget: 1600000, spent: 300000, icon: "🍔", type: "expense" },
      { name: "Di chuyển", budget: 400000, spent: 380000, icon: "🚗", type: "expense" },
      { name: "Giải trí", budget: 300000, spent: 250000, icon: "🎬", type: "expense" },
      { name: "Mua sắm", budget: 400000, spent: 340000, icon: "🛍️", type: "expense" },
      { name: "Lương", budget: 5000000, received: 5000000, icon: "💼", type: "income" },
      { name: "Thu hồi nợ", budget: 200000, received: 120000, icon: "💻", type: "income" },
    ]
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-bl from-blue-100 to-cyan-100 dark:from-gray-900 dark:to-gray-700">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex w-screen min-h-screen bg-gradient-to-bl from-blue-100 to-cyan-100 dark:from-gray-900 dark:to-gray-700">
      <div className="flex-none">
        <SideBar />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-6 overflow-auto"
      >
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  {currentMonth}
                </Button>
              </motion.div>
            </div>
          </header>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid gap-6 mb-8 md:grid-cols-3"
          >
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpCircle className="text-green-500" />
                  Income
                </CardTitle>
                <CardDescription>Tổng thu nhập cho {currentMonth}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{budgetData.income.toLocaleString()} VND</div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
              <CardHeader className="bg-red-50 dark:bg-red-900/20">
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownCircle className="text-red-500" />
                  Expenses
                </CardTitle>
                <CardDescription>Tổng chi tiêu cho {currentMonth}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{budgetData.expenses.toLocaleString()} VND</div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="text-blue-500" />
                  Remaining
                </CardTitle>
                <CardDescription>Ngân sách còn lại cho {currentMonth}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{budgetData.remaining.toLocaleString()} VND</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Tabs defaultValue="expenses" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="expenses" className="gap-2">
                  <ArrowDownCircle className="w-4 h-4" />
                  Expenses
                </TabsTrigger>
                <TabsTrigger value="income" className="gap-2">
                  <ArrowUpCircle className="w-4 h-4" />
                  Income
                </TabsTrigger>
                <TabsTrigger value="overview" className="gap-2">
                  <PieChart className="w-4 h-4" />
                  Overview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="expenses" className="space-y-4">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">Expense Categories</h2>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="text-black gap-2">
                        <PlusSquare className="w-4 h-4" />
                        <span className="text-black">Add Category</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Create <span className="text-red-500 m-1">expense</span> category
                        </DialogTitle>
                        <DialogDescription>
                          Categories are used to group your transactions
                        </DialogDescription>
                      </DialogHeader>
                      {/* Form content would go here, similar to your provided code */}
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button>Create</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {budgetData.categories
                    .filter(cat => cat.type === "expense")
                    .map((category, index) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                      >
                        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <span className="text-2xl" role="img">{category.icon}</span>
                                {category.name}
                              </CardTitle>
                              <span className="text-sm font-medium text-muted-foreground">
                                {category.spent.toLocaleString()} VND / {category.budget.toLocaleString()} VND
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <Progress
                                value={(category.spent / category.budget) * 100}
                                className="h-2"
                                indicatorClassName={
                                  category.spent > category.budget
                                    ? "bg-red-500"
                                    : category.spent / category.budget > 0.8
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{Math.round((category.spent / category.budget) * 100)}% used</span>
                                <span>{category.budget - category.spent} VND remaining</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="income" className="space-y-4">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold">Income Sources</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <PlusSquare className="w-4 h-4" />
                        Add Income
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Create <span className="text-emerald-500 m-1">income</span> category
                        </DialogTitle>
                        <DialogDescription>
                          Categories are used to group your transactions
                        </DialogDescription>
                      </DialogHeader>
                      {/* Form content would go here, similar to your provided code */}
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button>Create</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {budgetData.categories
                    .filter(cat => cat.type === "income")
                    .map((category, index) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                      >
                        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                <span className="text-2xl" role="img">{category.icon}</span>
                                {category.name}
                              </CardTitle>
                              <span className="text-sm font-medium text-muted-foreground">
                                {category.received.toLocaleString()} VND / {category.budget.toLocaleString()} VND
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <Progress
                                value={(category.received / category.budget) * 100}
                                className="h-2 bg-gray-200 dark:bg-gray-700"
                                indicatorClassName="bg-emerald-500"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{Math.round((category.received / category.budget) * 100)}% received</span>
                                <span>
                                  {category.received >= category.budget
                                    ? "0 VND remaining"
                                    : `${category.budget - category.received} VND expected`}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Tổng quan về ngân sách
                    </CardTitle>
                    <CardDescription>Tóm tắt vấn đề ngân sách trong {currentMonth}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-4 text-lg font-medium">Budget Health</h3>
                        <div className="p-6 text-center border rounded-lg">
                          <div className="mb-2 text-6xl font-bold text-emerald-500">72%</div>
                          <div className="text-sm text-muted-foreground">Budget health score</div>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                        Ngân sách hiện tại bạn đang thực hiện vẫn đang đi đúng theo lộ trình tiết kiệm {Math.round((budgetData.remaining / budgetData.income) * 100)}% từ thu nhập của bạn.
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="mb-4 text-lg font-medium">Spending Breakdown</h3>
                        <div className="space-y-4">
                          {budgetData.categories
                            .filter(cat => cat.type === "expense")
                            // .slice(0, 4)
                            .map(category => (
                              <div key={category.name} className="flex items-center gap-2">
                                <span className="text-xl" role="img">{category.icon}</span>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{category.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {category.spent.toLocaleString()} VND
                                    </span>
                                  </div>
                                  <Progress
                                    value={(category.spent / budgetData.expenses) * 100}
                                    className="h-1"
                                  />
                                </div>
                              </div>
                            ))}
                          {/* <Button variant="ghost" className="w-full text-sm" size="sm">
                            View all categories
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Budget;