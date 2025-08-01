import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderShop from "./OrderShop";
import { useTranslation } from "react-i18next";
import thinking from "../../assets/thinking.png";
import OrdersTabs from "../../components/OrdersTabs";
import OrdersSkeleton from "../../skeleton/user-profile/OrdersSkeleton";
import Typography from "@mui/material/Typography";
import Pagination from "../../components/Pagination";
const OrdersShop = ({ shopId }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { t } = useTranslation();
  const [todayOrders, setTodayOrders] = useState([]);
  const [yesterdayOrders, setYesterdayOrders] = useState([]);
  const [lastWeekOrders, setLastWeekOrders] = useState([]);
  const [lastTwoWeeksOrders, setLastTwoWeeksOrders] = useState([]);
  const [lastMonthOrders, setLastMonthOrders] = useState([]);
  const [last3MonthsOrders, setLast3MonthsOrders] = useState([]);
  const [last6MonthsOrders, setLast6MonthsOrders] = useState([]);
  const [lastYearOrders, setLastYearOrders] = useState([]);
  const [olderOrders, setOlderOrders] = useState([]);
  const LIMIT = 5;

  useEffect(() => {
    const fetchOrdersByShop = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shop/orders/${selectedFilter}?page=${page}&limit=${LIMIT}`
        );
        setTotalPages(response.data.totalPages);
        setTodayOrders(response.data.today);
        setYesterdayOrders(response.data.yesterday);
        setLastWeekOrders(response.data.lastWeek);
        setLastTwoWeeksOrders(response.data.lastTwoWeeks);
        setLastMonthOrders(response.data.lastMonth);
        setLast3MonthsOrders(response.data.last3Months);
        setLast6MonthsOrders(response.data.last6Months);
        setLastYearOrders(response.data.lastYear);
        setOlderOrders(response.data.older);
        setTotalOrders(response.data.total);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersByShop();
  }, [shopId,selectedFilter,page]);
  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  if (loading) {
    return (
      <div className="w-2/3 bg-white shadow-md rounded-md pb-3 pt-2">
        <OrdersTabs
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          t={t}
        />
        <OrdersSkeleton />
      </div>
    );
  }
  return (
    <div className="w-full sm:w-2/3 bg-white shadow-md rounded-md pb-3 pt-2">
      <OrdersTabs
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        t={t}
      />
      {todayOrders?.length > 0 && (
        <>
          <Typography
            variant="body1"
            align="center"
            sx={{
              py: 2,
              color: "grey.800",
              // fontWeight: 600,
            }}
          >
            Today Orders
          </Typography>
          <div className="flex flex-col gap-y-3 px-3">
            {todayOrders?.map((order, index) => (
              <OrderShop
                order={order}
                index={todayOrders?.length - index}
                key={index}
              />
            ))}
          </div>
        </>
      )}
      {yesterdayOrders?.length > 0 && (
        <>
          <Typography
            variant="body1"
            align="center"
            sx={{
              py: 2,
              color: "grey.800",
              // fontWeight: 600,
            }}
          >
            Yesterday Orders
          </Typography>
          <div className="flex flex-col gap-y-3 px-3">
            {yesterdayOrders?.map((order, index) => (
              <OrderShop
                order={order}
                index={yesterdayOrders?.length - index}
                key={index}
              />
            ))}
          </div>
        </>
      )}
      {lastWeekOrders?.length > 0 && (
        <>
          <Typography
            variant="body1"
            align="center"
            sx={{
              py: 2,
              color: "grey.800",
              // fontWeight: 600,
            }}
          >
            Last week Orders
          </Typography>
          <div className="flex flex-col gap-y-3 px-3">
            {lastWeekOrders?.map((order, index) => (
              <OrderShop
                order={order}
                index={lastWeekOrders?.length - index}
                key={index}
              />
            ))}
          </div>
        </>
      )}
      {lastTwoWeeksOrders?.length > 0 && (
        <>
          <Typography
            variant="body1"
            align="center"
            sx={{
              py: 2,
              color: "grey.800",
              // fontWeight: 600,
            }}
          >
            Last 2 weeks Orders
          </Typography>
          <div className="flex flex-col gap-y-3 px-3">
            {lastTwoWeeksOrders?.map((order, index) => (
              <OrderShop
                order={order}
                index={lastTwoWeeksOrders?.length - index}
                key={index}
              />
            ))}
          </div>
        </>
      )}
      {lastMonthOrders?.length > 0 && (
        <>
          <Typography
            variant="body1"
            align="center"
            sx={{
              py: 2,
              color: "grey.800",
              // fontWeight: 600,
            }}
          >
            Last month Orders
          </Typography>
          <div className="flex flex-col gap-y-3 px-3">
            {lastMonthOrders?.map((order, index) => (
              <OrderShop
                order={order}
                index={lastMonthOrders?.length - index}
                key={index}
              />
            ))}
          </div>
        </>
      )}
      {last3MonthsOrders?.length > 0 && (
        <>
          <Typography
            variant="body1"
            align="center"
            sx={{
              py: 2,
              color: "grey.800",
              // fontWeight: 600,
            }}
          >
            Last 3 months Orders
          </Typography>
          <div className="flex flex-col gap-y-3 px-3">
            {last3MonthsOrders?.map((order, index) => (
              <OrderShop
                order={order}
                index={last3MonthsOrders?.length - index}
                key={index}
              />
            ))}
          </div>
        </>
      )}
      {last6MonthsOrders?.length > 0 && (
        <>
          <Typography
            variant="body1"
            align="center"
            sx={{
              py: 2,
              color: "grey.800",
              // fontWeight: 600,
            }}
          >
            Last 6 months Orders
          </Typography>
          <div className="flex flex-col gap-y-3 px-3">
            {last6MonthsOrders?.map((order, index) => (
              <OrderShop
                order={order}
                index={last6MonthsOrders?.length - index}
                key={index}
              />
            ))}
          </div>
        </>
      )}
      {lastYearOrders?.length > 0 && (
        <>
          <Typography
            variant="body1"
            align="center"
            sx={{
              py: 2,
              color: "grey.800",
              // fontWeight: 600,
            }}
          >
            Last Year Orders
          </Typography>
          <div className="flex flex-col gap-y-3 px-3">
            {lastYearOrders?.map((order, index) => (
              <OrderShop
                order={order}
                index={lastYearOrders?.length - index}
                key={index}
              />
            ))}
          </div>
        </>
      )}
      {olderOrders?.length > 0 && (
        <>
          <Typography
            variant="body1"
            align="center"
            sx={{
              py: 2,
              color: "grey.800",
              // fontWeight: 600,
            }}
          >
            old Orders
          </Typography>
          <div className="flex flex-col gap-y-3 px-3">
            {olderOrders?.map((order, index) => (
              <OrderShop
                order={order}
                index={olderOrders?.length - index}
                key={index}
              />
            ))}
          </div>
        </>
      )}
      {totalOrders > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
      {totalOrders == 0 && selectedFilter == "all" && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3">
          <img src={thinking} className="h-16 w-16 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-center max-w-md">
            You don’t have any orders at the moment. Once customers place
            orders, they’ll appear here for you to manage.
          </p>
        </div>
      )}
      {totalOrders == 0 && selectedFilter !== "all" && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3">
                {/* <div className="text-5xl mb-4">🛒</div> */}
                <img src={thinking} className="h-16 w-16 mb-4" />
      
                <h2 className="text-2xl font-semibold mb-2">
                  No {selectedFilter} Orders
                </h2>
                <p className="text-center max-w-sm">
                  Looks like you dont’t have any {selectedFilter} orders.
                </p>
              </div>
            )}
    </div>
  );
};

export default OrdersShop;
