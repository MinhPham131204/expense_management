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
import { Category, Transaction, SubCategory } from "@/lib/types";
import { typeMap } from "@/lib/helper";

interface StatisticProps {
  month: number;
  year: number;
  income: number;
  expense: number;
  savings: number;
}
interface CategoryTrend {
  category: string;
  previousMonth: number;
  currentMonth: number;
  change: number;
  icon: string;
}

const matchIcon: { [key: string]: string } = {
  "Hóa đơn": "💳",
  "Tiền thuê nhà": "🏠",
  "Mua sắm": "🛍️",
  "Sức khỏe": "💊",
  "Làm đẹp": "💅",
  "Giải trí": "🎬",
  "Ăn uống": "🍔",
  "Chợ - Siêu thị": "🛒",
  "Di chuyển": "🚗",
  Lương: "💵",
  Thưởng: "🏆",
  "Trợ cấp": "💰",
  "Thu hồi nợ": "📉",
  "Kinh doanh": "💡",
};

const Statistic: React.FC<{
  transactions: Transaction[];
  categories: Category[];
  transactionsPeriod: StatisticProps[];
}> = ({ transactionsPeriod, transactions, categories }) => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("3months");
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "MM/yyyy")
  );
  const [previousMonth, setPreviousMonth] = useState(
    format(subMonths(new Date(), 1), "MM/yyyy")
  );
  const [categoryTrends, setCategoryTrends] = useState<CategoryTrend[]>([]);

  const getMonth = (date: string) => new Date(date).getMonth();

  // console.log(transactions);
  // console.log(categories);

  useEffect(() => {
    const calculateCategoryTrends = (
      transactions: Transaction[],
      categories: SubCategory[]
    ): CategoryTrend[] => {
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
        const currentMonthTotal = currentMonthTransactions.reduce(
          (sum, t) => sum + Number(t.money),
          0
        );
        const previousMonthTotal = previousMonthTransactions.reduce(
          (sum, t) => sum + Number(t.money),
          0
        );

        // Calculate the change
        const change =
          currentMonthTotal !== 0
            ? (
                ((currentMonthTotal - previousMonthTotal) / currentMonthTotal) *
                100
              ).toFixed(2)
            : previousMonthTotal !== 0
            ? -100
            : 0;

        // Return the CategoryTrend object
        return {
          category: category.name,
          previousMonth: previousMonthTotal,
          currentMonth: currentMonthTotal,
          change,
          icon: matchIcon[category.name],
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

  const forecastData = categoryTrends.map((cat) => ({
    key: cat.category,
    title: `Dự báo ${cat.category}`,
    description: `Dự kiến chi khoảng ${Math.round(
      cat.currentMonth * 1.1
    ).toLocaleString()} VND`,
    icon: cat.icon,
  }));

  const savingRate = (lastMonthSavings / lastMonthIncome) * 100;

const getSavingColor = (rate: number) => {
  if (rate < 0) {
    return {
      cardBg: "bg-red-50 dark:bg-red-900/20",
      iconBg: "bg-red-100 dark:bg-red-800",
      iconColor: "text-red-600 dark:text-red-300",
      Icon: ArrowDown,
    };
  }
  if (rate < 10) {
    return {
      cardBg: "bg-yellow-50 dark:bg-yellow-900/20",
      iconBg: "bg-yellow-100 dark:bg-yellow-800",
      iconColor: "text-yellow-600 dark:text-yellow-300",
      Icon: TrendingUp,
    };
  }
  if (rate < 30) {
    return {
      cardBg: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-100 dark:bg-green-800",
      iconColor: "text-green-600 dark:text-green-300",
      Icon: TrendingUp,
    };
  }
  return {
    cardBg: "bg-emerald-50 dark:bg-emerald-900/20",
    iconBg: "bg-emerald-100 dark:bg-emerald-800",
    iconColor: "text-emerald-600 dark:text-emerald-300",
    Icon: TrendingUp,
  };
};

const savingColor = getSavingColor(savingRate);


  return (
    <div className="flex w-screen min-h-screen bg-gradient-to-bl from-blue-100 to-cyan-100 dark:from-gray-900 dark:to-gray-700">
      <div className=" flex-1">
        <SideBar />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-4 p-6"
      >
        <div className="max-w-[90%] mx-auto pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-bold text-xl">
                  <TrendingUp className="w-6 h-6" />
                  Tổng quan tài chính
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Xu hướng hiệu suất và số liệu chính
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 text-center border rounded-lg">
                        <p className="text-xl font-bold">Thu nhập</p>
                        <p className="mt-1 text-xl font-bold">
                          {lastMonthIncome} VND
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-lg",
                            incomeVsAvg >= 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {incomeVsAvg >= 0 ? (
                            <ArrowUp className="inline w-3 h-3" />
                          ) : (
                            <ArrowDown className="inline w-3 h-3" />
                          )}
                          {Math.abs(incomeVsAvg).toFixed(1)}%
                        </p>
                      </div>

                      <div className="p-4 text-center border rounded-lg">
                        <p className="text-xl font-bold">Chi phí</p>
                        <p className="mt-1 text-xl font-bold">
                          {lastMonthExpenses} VND
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-lg",
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
                          {Math.abs(expensesVsAvg).toFixed(1)}%
                        </p>
                      </div>

                      <div className="p-4 text-center border rounded-lg">
                        <p className="text-xl font-bold">Tiết kiệm</p>
                        <p className="mt-1 text-xl font-bold">
                          {lastMonthSavings} VND
                        </p>
                        <p
                          className={cn(
                            "mt-1 text-lg",
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
                          {Math.abs(savingsVsAvg).toFixed(1)}%
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
                          <Tooltip
                            content={({ payload, label }) => {
                              if (!payload || !payload.length) return null;
                              return (
                                <div className="p-2 bg-white border rounded shadow text-sm">
                                  <p className="font-semibold">{label}</p>
                                  {payload.map((entry, index) => {
                                    const nameMap: Record<string, string> = {
                                      income: "Thu nhập",
                                      expense: "Chi phí",
                                      savings: "Tiết kiệm",
                                    };
                                    return (
                                      <p
                                        key={index}
                                        style={{ color: entry.color }}
                                      >
                                        {nameMap[entry.dataKey]}:{" "}
                                        {Number(entry.value).toLocaleString()}{" "}
                                        VND
                                      </p>
                                    );
                                  })}
                                </div>
                              );
                            }}
                          />
                          <Legend
                            formatter={(value: string) => {
                              const nameMap: Record<string, string> = {
                                income: "Thu nhập",
                                expense: "Chi phí",
                                savings: "Tiết kiệm",
                              };
                              return nameMap[value] || value;
                            }}
                          />
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
                  <div className={`p-5 mb-5 rounded-lg ${savingColor.cardBg}`}>
  <div className="flex items-center justify-between mb-2">
    <div>
      <p className="text-lg font-medium">Tỉ lệ tiết kiệm</p>
      <p className="text-2xl font-bold">
        {savingRate.toFixed(1)}%
      </p>
    </div>
    <div className={`p-3 rounded-full ${savingColor.iconBg}`}>
      <savingColor.Icon className={`w-6 h-6 ${savingColor.iconColor}`} />
    </div>
  </div>
</div>


                    <h3 className="mb-3 text-lg font-medium">
                      Tương quan với tháng trước
                    </h3>
                    <div className="space-y-3">
                      {categoryTrends
                        .sort(
                          (a, b) =>
                            Math.abs(b.currentMonth - b.previousMonth) -
                            Math.abs(a.currentMonth - a.previousMonth)
                        )
                        .slice(0, 4)
                        .map((category) => (
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
                                  (category.change < 0 &&
                                    typeMap[category.category] ===
                                      "Chi tiêu") ||
                                    (category.change > 0 &&
                                      typeMap[category.category] === "Thu nhập")
                                    ? "text-green-500"
                                    : category.change !== 0
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

          {/* <motion.div
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
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Tabs defaultValue="trends">
              <TabsList>
                <TabsTrigger value="trends" className="gap-2">
                  <LineChartIcon className="w-4 h-4 text-black" />
                  <span className="text-gray-700">Xu hướng tiêu dùng</span>
                </TabsTrigger>
                <TabsTrigger value="category" className="gap-2">
                  <BarChart2 className="w-4 h-4 text-black" />
                  <span className="text-gray-700">Thống kê theo danh mục</span>
                </TabsTrigger>
                {/* <TabsTrigger value="forecast" className="gap-2">
                  <PieChart className="w-4 h-4 text-black" />
                  <span className="text-gray-700">Dự báo tương lai</span>
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="trends" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      Phân tích xu hướng tiêu dùng
                    </CardTitle>
                    <CardDescription>
                      Khuôn khổ tiêu dùng của bạn thay đổi như thế nào trong 3
                      tháng qua
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
                          <Tooltip
                            content={({ payload, label }) => {
                              if (!payload || !payload.length) return null;
                              return (
                                <div className="p-2 bg-white border rounded shadow text-sm">
                                  <p className="font-semibold">{label}</p>
                                  {payload.map((entry, index) => {
                                    const nameMap: Record<string, string> = {
                                      income: "Thu nhập",
                                      expense: "Chi phí",
                                      savings: "Tiết kiệm",
                                    };
                                    return (
                                      <p
                                        key={index}
                                        style={{ color: entry.color }}
                                      >
                                        {nameMap[entry.dataKey]}:{" "}
                                        {Number(entry.value).toLocaleString()}{" "}
                                        VND
                                      </p>
                                    );
                                  })}
                                </div>
                              );
                            }}
                          />
                          <Legend
                            formatter={(value: string) => {
                              const nameMap: Record<string, string> = {
                                income: "Thu nhập",
                                expense: "Chi phí",
                                savings: "Tiết kiệm",
                              };
                              return nameMap[value] || value;
                            }}
                          />
                          <Bar
                            dataKey="expense"
                            fill="#ef4444"
                            name="Chi tiêu"
                          />
                          <Bar
                            dataKey="savings"
                            fill="#3b82f6"
                            name="Tiết kiệm"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid gap-4 mt-6 md:grid-cols-3">
                      <div className="p-4 border rounded-lg">
                        <p className="text-lg font-bold text-muted-foreground">
                          Tiêu dùng trung bình trên tháng
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                          {monthlyAvgExpenses.toFixed(0)} VND
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-lg font-bold text-muted-foreground">
                          Tháng tiêu dùng nhiều nhất
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
                        <p className="text-lg font-bold text-muted-foreground">
                          Tháng tiết kiệm nhất
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
                      <div className="flex flex-col gap-1">
                        <CardTitle className="text-xl font-bold">
                          Phân tích tiêu dùng danh mục
                        </CardTitle>
                        <CardDescription>
                          So sánh {previousMonth} với {currentMonth}
                        </CardDescription>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div> */}
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
                                Tháng trước
                              </div>
                              <div className="text-xs font-semibold text-blue-600">
                                Tháng này
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

              {/* <TabsContent value="forecast" className="mt-4">
                <div className="grid gap-6 md:grid-cols-2">
                  {forecastData.map(item => (
                    <Card key={item.key} className="p-4 hover:shadow-lg transition">
                      <CardHeader className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <CardTitle>{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent> */}
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Statistic;
