import { useState, useEffect } from "react";
import SideBar from "@/components/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  BarChart2,
  LineChart as LineChartIcon,
  PieChart,
  Lightbulb,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subMonths } from "date-fns";
import { Category, Transaction, SubCategory } from '@/lib/types';

interface StatisticProps {
  month: number;
  year: number;
  income: number;
  expense: number;
  savings: number;
}
interface CategoryTrend {
  category: string,
  previousMonth: number,
  currentMonth: number,
  change: number,
  icon: string,
}

const matchIcon: { [key: string]: string } = {
  'Hóa đơn': '💳',
  'Tiền thuê nhà': '🏠',
  'Mua sắm': '🛍️',
  'Sức khỏe': '💊',
  'Làm đẹp': '💅',
  'Giải trí': '🎬',
  'Ăn uống': '🍔',
  'Chợ - Siêu thị': '🛒',
  'Di chuyển': '🚗',
  'Lương': '💵',
  'Thưởng': '🏆',
  'Trợ cấp': '💰',
  'Thu hồi nợ': '📉',
  'Kinh doanh': '💡'
}


const Statistic: React.FC<{ transactions: Transaction[]; categories: Category[] ; transactionsPeriod: StatisticProps[] }> = ({
  transactionsPeriod, transactions, categories
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("3months");
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "MMMM yyyy")
  );
  const [previousMonth, setPreviousMonth] = useState(
    format(subMonths(new Date(), 1), "MMMM yyyy")
  );
  const [categoryTrends, setCategoryTrends] = useState<CategoryTrend[]>([]);

  const getMonth = (date: string) => new Date(date).getMonth();

  
  // console.log(transactions);
  // console.log(categories);
  
  useEffect(() => {
    const calculateCategoryTrends = (transactions: Transaction[], categories: SubCategory[]): CategoryTrend[] => {
      // Group transactions by category ID
      const groupedByCategory: { [key: string]: Transaction[] } = {};
    
      transactions.forEach((transaction) => {
        const categoryId = transaction.categoryID._id;
        if (!groupedByCategory[categoryId]) {
          groupedByCategory[categoryId] = [];
        }
        groupedByCategory[categoryId].push(transaction);
      });

      // console.log(groupedByCategory);
      
    
      // Calculate trends for each category
      return categories.map((category) => {
        const categoryTransactions = groupedByCategory[category._id] || [];
        
        // Get the current month and previous month transactions
        const currentMonthTransactions = categoryTransactions.filter(
          (t) => getMonth(t.datetime) === new Date().getMonth()
        );

        console.log(currentMonthTransactions);
        
        const previousMonthTransactions = categoryTransactions.filter(
          (t) => getMonth(t.datetime) === new Date().getMonth() - 1
        );
    
        // Calculate the totals for the current and previous months
        const currentMonthTotal = currentMonthTransactions.reduce((sum, t) => sum + Number(t.money), 0);
        const previousMonthTotal = previousMonthTransactions.reduce((sum, t) => sum + Number(t.money), 0);
    
        // Calculate the change
        const change = currentMonthTotal !== 0
        ? ((currentMonthTotal - previousMonthTotal) / currentMonthTotal * 100).toFixed(2)
        : (previousMonthTotal !== 0 ? -100 : 0);
          
        // Return the CategoryTrend object
        return {
          category: category.name,
          previousMonth: previousMonthTotal,
          currentMonth: currentMonthTotal,
          change,
          icon: matchIcon[category.name]
        };
      });
    };

    setCategoryTrends(calculateCategoryTrends(transactions, categories));
  }, [transactions, categories]);

  console.log(categoryTrends);
  

  // Sample recommendations based on spending patterns
  const recommendations = [
    {
      title: "Food Budget Optimization",
      description:
        "You've reduced your food spending by 7.1%. Consider maintaining this habit while ensuring nutritional needs are met.",
      actionable:
        "Try meal planning for next month to further reduce costs without sacrificing quality.",
      category: "Food",
      icon: "🍔",
      priority: "medium",
    },
    {
      title: "Shopping Expenses",
      description:
        "Great job reducing shopping expenses by 15%! This is contributing significantly to your improved savings.",
      actionable: "Consider setting a similar budget target for next month.",
      category: "Shopping",
      icon: "🛍️",
      priority: "high",
    },
    {
      title: "Entertainment Budget",
      description:
        "You've decreased entertainment spending by 16.7%, which is helping your overall budget.",
      actionable:
        "Look for free or low-cost entertainment options to maintain this trend.",
      category: "Entertainment",
      icon: "🎬",
      priority: "low",
    },
    {
      title: "Housing Cost Review",
      description:
        "Your housing costs remain constant at $1,500 monthly, representing about 40% of your expense.",
      actionable:
        "Research if refinancing or negotiating rent could lower this major expense.",
      category: "Housing",
      icon: "🏠",
      priority: "high",
    },
  ];

  // Calculate insights based on the data
  const monthlyAvgIncome =
    transactionsPeriod.reduce((acc, item) => acc + item.income, 0) /
    transactionsPeriod.length;
  const monthlyAvgExpenses =
    transactionsPeriod.reduce((acc, item) => acc + item.expense, 0) /
    transactionsPeriod.length;
  const monthlyAvgSavings =
    transactionsPeriod.reduce((acc, item) => acc + item.savings, 0) /
    transactionsPeriod.length;

  const lastMonthIncome =
    transactionsPeriod[transactionsPeriod.length - 1].income;
  const lastMonthExpenses =
    transactionsPeriod[transactionsPeriod.length - 1].expense;
  const lastMonthSavings =
    transactionsPeriod[transactionsPeriod.length - 1].savings;

  const incomeVsAvg =
    ((lastMonthIncome - monthlyAvgIncome) / monthlyAvgIncome) * 100;
  const expensesVsAvg =
    ((lastMonthExpenses - monthlyAvgExpenses) / monthlyAvgExpenses) * 100;
  const savingsVsAvg =
    ((lastMonthSavings - monthlyAvgSavings) / monthlyAvgSavings) * 100;

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-6 overflow-auto"
      >
        <div className="max-w-6xl mx-auto pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Financial Overview
                </CardTitle>
                <CardDescription>
                  Performance trends and key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 text-center border rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">
                          Income
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          {lastMonthIncome} VND
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-xs",
                            incomeVsAvg >= 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {incomeVsAvg >= 0 ? (
                            <ArrowUp className="inline w-3 h-3" />
                          ) : (
                            <ArrowDown className="inline w-3 h-3" />
                          )}
                          {Math.abs(incomeVsAvg).toFixed(1)}% vs avg
                        </p>
                      </div>

                      <div className="p-4 text-center border rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">
                          Expenses
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          {lastMonthExpenses} VND
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-xs",
                            expensesVsAvg <= 0
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {expensesVsAvg <= 0 ? (
                            <ArrowDown className="inline w-3 h-3" />
                          ) : (
                            <ArrowUp className="inline w-3 h-3" />
                          )}
                          {Math.abs(expensesVsAvg).toFixed(1)}% vs avg
                        </p>
                      </div>

                      <div className="p-4 text-center border rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">
                          Savings
                        </p>
                        <p className="mt-1 text-2xl font-bold">
                          {lastMonthSavings} VND
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-xs",
                            savingsVsAvg >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {savingsVsAvg >= 0 ? (
                            <ArrowUp className="inline w-3 h-3" />
                          ) : (
                            <ArrowDown className="inline w-3 h-3" />
                          )}
                          {Math.abs(savingsVsAvg).toFixed(1)}% vs avg
                        </p>
                      </div>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={transactionsPeriod}
                          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#10b981"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#ef4444"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="savings"
                            stroke="#3b82f6"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-medium">
                      Spending Efficiency
                    </h3>
                    <div className="p-5 mb-5 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">Savings Rate</p>
                          <p className="text-2xl font-bold">
                            {(
                              (lastMonthSavings / lastMonthIncome) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
                          <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-300" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        You're saving{" "}
                        {((lastMonthSavings / lastMonthIncome) * 100).toFixed(
                          1
                        )}
                        % of your income, which is
                        {savingsVsAvg >= 0 ? " above " : " below "}
                        your average of{" "}
                        {((monthlyAvgSavings / monthlyAvgIncome) * 100).toFixed(
                          1
                        )}
                        %.
                      </p>
                    </div>

                    <h3 className="mb-3 text-lg font-medium">
                      Monthly Comparison
                    </h3>
                    <div className="space-y-3">
                      {categoryTrends.sort((a, b) => Math.abs(b.currentMonth - b.previousMonth) - Math.abs(a.currentMonth - a.previousMonth)).slice(0, 4).map((category) => (
                        <div
                          key={category.category}
                          className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl" role="img">
                                {category.icon}
                              </span>
                              <span className="font-medium">
                                {category.category}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "text-sm font-medium",
                                category.change < 0
                                  ? "text-green-500"
                                  : category.change > 0
                                  ? "text-red-500"
                                  : "text-gray-500"
                              )}
                            >
                              {category.change === 0
                                ? "No change"
                                : category.change < 0
                                ? `↓ ${Math.abs(category.change)}%`
                                : `↑ ${category.change}%`}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className="flex-1">
                              {category.previousMonth} VND
                            </span>
                            <span className="mx-2">→</span>
                            <span className="flex-1">
                              {category.currentMonth} VND
                            </span>
                          </div>
                        </div>
                      ))}
                      {/* <Button
                        variant="ghost"
                        className="w-full text-sm"
                        size="sm"
                      >
                       <span className="text-black">View all categories</span>
                      </Button> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="mb-4 text-2xl font-bold">
              Recommendations for Next Period
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.4, duration: 0.5 }}
                >
                  <Card
                    className={cn(
                      "border-l-4 transition-all duration-200 hover:shadow-md",
                      rec.priority === "high"
                        ? "border-l-red-500"
                        : rec.priority === "medium"
                        ? "border-l-yellow-500"
                        : "border-l-green-500"
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <span className="text-2xl" role="img">
                            {rec.icon}
                          </span>
                          {rec.title}
                        </CardTitle>
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full",
                            rec.priority === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                              : rec.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          )}
                        >
                          {rec.priority} priority
                        </span>
                      </div>
                      <CardDescription>{rec.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                        <Lightbulb className="flex-shrink-0 w-5 h-5 text-blue-500" />
                        <p className="text-sm">{rec.actionable}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Tabs defaultValue="trends">
              <TabsList>
                <TabsTrigger value="trends" className="gap-2">
                  <LineChartIcon className="w-4 h-4 text-black" />
                  <span className="text-gray-700">Spending Trends</span>
                </TabsTrigger>
                <TabsTrigger value="category" className="gap-2">
                  <BarChart2 className="w-4 h-4 text-black" />
                  <span className="text-gray-700">Category Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="forecast" className="gap-2">
                  <PieChart className="w-4 h-4 text-black" />
                  <span className="text-gray-700">Future Forecast</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Spending Trend Analysis</CardTitle>
                    <CardDescription>
                      How your spending patterns have changed over{" "} the last 3 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={transactionsPeriod}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="expense"
                            fill="#ef4444"
                            name="Expenses"
                          />
                          <Bar
                            dataKey="savings"
                            fill="#3b82f6"
                            name="Savings"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid gap-4 mt-6 md:grid-cols-3">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">
                          Average Monthly Expenses
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                          {monthlyAvgExpenses.toFixed(0)} VND
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">
                          Most Expensive Month
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                          {
                            transactionsPeriod.reduce((max, item) =>
                              max.expense > item.expense ? max : item
                            ).month
                          }
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">
                          Best Savings Month
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                          {
                            transactionsPeriod.reduce((max, item) =>
                              max.savings > item.savings ? max : item
                            ).month
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="category" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Category Spending Analysis</CardTitle>
                        <CardDescription>
                          Comparing {previousMonth} to {currentMonth}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {categoryTrends.map((category) => (
                        <div key={category.category}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl" role="img">
                                {category.icon}
                              </span>
                              <span className="font-medium">
                                {category.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">
                                {category.previousMonth} VND →{" "}
                                {category.currentMonth} VND
                              </span>
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  category.change < 0
                                    ? "text-green-500"
                                    : category.change > 0
                                    ? "text-red-500"
                                    : "text-gray-500"
                                )}
                              >
                                {category.change === 0
                                  ? "No change"
                                  : category.change < 0
                                  ? `↓ ${Math.abs(category.change)}%`
                                  : `↑ ${category.change}%`}
                              </span>
                            </div>
                          </div>
                          <div className="relative pt-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-xs font-semibold text-green-600">
                                Previous Month
                              </div>
                              <div className="text-xs font-semibold text-blue-600">
                                Current Month
                              </div>
                            </div>
                            <div className="flex h-2 mb-4 overflow-hidden text-xs bg-gray-200 rounded dark:bg-gray-700">
                              <div
                                style={{
                                  width: `${
                                    (category.previousMonth / 1500) * 100
                                  }%`,
                                }}
                                className="flex flex-col justify-center text-center text-white bg-green-500 shadow-none whitespace-nowrap"
                              ></div>
                            </div>
                            <div className="flex h-2 overflow-hidden text-xs bg-gray-200 rounded dark:bg-gray-700">
                              <div
                                style={{
                                  width: `${
                                    (category.currentMonth / 1500) * 100
                                  }%`,
                                }}
                                className="flex flex-col justify-center text-center text-white bg-blue-500 shadow-none whitespace-nowrap"
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forecast" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Next Month Forecast</CardTitle>
                    <CardDescription>
                      Projected budget allocation based on your spending
                      patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <div className="p-6 mb-4 text-center border rounded-lg">
                          <h3 className="mb-2 text-lg font-medium">
                            Projected Savings
                          </h3>
                          <p className="text-4xl font-bold text-blue-500">
                            155,000 VND
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            +6.9% compared to current month
                          </p>
                        </div>

                        <h3 className="mb-3 text-lg font-medium">
                          Optimized Budget Plan
                        </h3>
                        <div className="space-y-3">
                          {categoryTrends.slice(0, 5).map((category) => (
                            <div
                              key={category.category}
                              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl" role="img">
                                  {category.icon}
                                </span>
                                <span>{category.category}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">
                                  Current: ${category.currentMonth}
                                </span>
                                <span className="text-sm font-medium">
                                  Suggested: $
                                  {Math.round(category.currentMonth * 0.95)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-4 text-lg font-medium">
                          If You Follow Recommendations
                        </h3>
                        <div className="p-5 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-medium">
                              6-Month Savings Projection
                            </p>
                            <p className="text-xl font-bold">960.000 VND</p>
                          </div>
                          <Progress value={75} className="h-2 mb-2" />
                          <p className="text-sm text-muted-foreground">
                            75% of your yearly savings goal
                          </p>
                        </div>

                        <h3 className="mb-3 text-lg font-medium">
                          Top Optimization Opportunities
                        </h3>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <p className="font-medium">Food & Groceries</p>
                            <p className="text-sm text-muted-foreground">
                              Potential savings of 70 VND/month with meal
                              planning
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <p className="font-medium">Entertainment</p>
                            <p className="text-sm text-muted-foreground">
                              Potential savings of 50 VND/month by using free
                              alternatives
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                            <p className="font-medium">Transportation</p>
                            <p className="text-sm text-muted-foreground">
                              Potential savings of 40 VND/month with carpooling
                            </p>
                          </div>
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

export default Statistic;
