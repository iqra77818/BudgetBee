import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  DatePicker,
  Alert,
} from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import moment from "moment";
import Analytics from "../components/Analytics";
import { BASE_URL } from "../utils/baseURL";
import { getResponseError } from "../utils/getResponseError";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { RangePicker } = DatePicker;
const { Search } = Input;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);
  const [trasactionError, setTrasactionError] = useState(null);

  //table data
  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      render: (text, record, index) => index + 1,
    },
    {
      id: "1",
      title: "Date(yyyy-mm-dd)",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      id: "2",
      title: "Amount(Rs.)",
      dataIndex: "amount",
    },
    {
      id: "3",
      title: "Type",
      dataIndex: "type",
    },
    {
      id: "4",
      title: "Category",
      dataIndex: "category",
    },
    {
      id: "5",
      title: "Refrence",
      dataIndex: "refrence",
    },
    {
      id: "6",
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            style={{ color: "green" }}
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            style={{ color: "red" }}
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  // Memoized getAllTransactions with useCallback to avoid ESLint warning
  const getAllTransactions = useCallback(async () => {
    try {
      setTrasactionError(null);
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/transections/get-transection`,
        {
          frequency,
          selectedDate,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );
      console.log("res:", res);
      setAllTransection(res.data.transactions);
      setLoading(false);
      setTrasactionError(null);
    } catch (error) {
      setLoading(false);
      setTrasactionError(getResponseError(error));
      message.error("Fetch Issue With Transactions...!");
    }
  }, [frequency, selectedDate, type]);

  //useEffect Hook now depends only on getAllTransactions
  useEffect(() => {
    getAllTransactions();
  }, [getAllTransactions]);

  //delete handler
  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this transaction?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteTransaction(record);
      },
      onCancel: () => {},
    });
  };

  const deleteTransaction = async (record) => {
    try {
      setLoading(true);
      const transactionId = record.transactionId;
      await axios.post(
        `${BASE_URL}/api/v1/transections/delete-transection/${transactionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        }
      );

      setLoading(false);
      getAllTransactions();
      message.success("Transaction Deleted successfully...!", {
        duration: 2,
        position: "top",
        marginTop: "20",
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      setTrasactionError(getResponseError(error));
      message.error("Unable to delete");
    }
  };

  // form handling
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (editable) {
        const transactionId = editable.transactionId;
        await axios.post(
          `${BASE_URL}/api/v1/transections/edit-transection/${transactionId}`,
          {
            ...values,
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).token
              }`,
            },
          }
        );
        setLoading(false);

        getAllTransactions();

        message.success("Transaction Updated Successfully", {
          position: "top",
          marginTop: "20",
        });
      } else {
        await axios.post(
          `${BASE_URL}/api/v1/transections/add-transection`,
          {
            ...values,
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).token
              }`,
            },
          }
        );
        setLoading(false);

        getAllTransactions();

        message.success("Transaction Added Successfully", {
          position: "top",
          marginTop: "20",
        });
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      setTrasactionError(getResponseError(error));
      message.error("Please fill all fields");
    }
  };

  // Search handler
  const onSearch = (value) => {
    if (!value) {
      getAllTransactions(); // Reset to all filtered data if search is cleared
      return;
    }

    const filteredData = allTransection.filter((transaction) =>
      Object.values(transaction).some((field) =>
        field?.toString().toLowerCase().includes(value.toLowerCase())
      )
    );

    setAllTransection(filteredData);
  };

  // Export to excel
  const exportToExcel = () => {
    setTrasactionError(null);
    if (allTransection.length === 0) {
      setTrasactionError("No data available to export.");
      return;
    }

    const exportData = allTransection.map((transaction, index) => ({
      "S.No": index + 1,
      "Date (yyyy-mm-dd)": moment(transaction.date).format("YYYY-MM-DD"),
      "Amount (Rs.)": transaction.amount,
      Type: transaction.type,
      Category: transaction.category,
      Reference: transaction.refrence,
      Description: transaction.description,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    const currentDate = moment().format("DD-MM-YYYY");
    saveAs(data, `Transactions(${currentDate}).xlsx`);
  };

  return (
    <>
      <Layout>
        <div className="transaction-page">
          {trasactionError && (
            <Alert
              message={trasactionError}
              type="error"
              showIcon
              style={{ marginBottom: 10 }}
            />
          )}
          <div className="filters">
            <div>
              <h6>Select Frequency</h6>
              <Select
                value={frequency}
                onChange={(values) => setFrequency(values)}
              >
                <Select.Option value="7">LAST 1 Week</Select.Option>
                <Select.Option value="30">LAST 1 Month</Select.Option>
                <Select.Option value="365">LAST 1 Year</Select.Option>
                <Select.Option value="custom">Custom</Select.Option>
              </Select>
              {frequency === "custom" && (
                <RangePicker
                  value={selectedDate}
                  onChange={(values) => setSelectedate(values)}
                />
              )}
            </div>
            <div className="filter-tab ">
              <h6>Select Type</h6>
              <Select value={type} onChange={(values) => setType(values)}>
                <Select.Option value="all">ALL</Select.Option>
                <Select.Option value="Income">INCOME</Select.Option>
                <Select.Option value="Expense">EXPENSE</Select.Option>
              </Select>
            </div>
            <div className="switch-icons">
              <UnorderedListOutlined
                className={`mx-2 ${
                  viewData === "table" ? "active-icon" : "inactive-icon"
                }`}
                onClick={() => setViewData("table")}
              />
              <AreaChartOutlined
                className={`mx-2 ${
                  viewData === "analytics" ? "active-icon" : "inactive-icon"
                }`}
                onClick={() => setViewData("analytics")}
              />
            </div>
            <div className="search-bar">
              <Search
                placeholder="search text"
                allowClear
                onSearch={onSearch}
                style={{
                  width: 180,
                }}
              />
            </div>
            <div className="add-btn">
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                ADD NEW
              </button>
            </div>
            <div className="export-btn">
              <button
                className="btn btn-primary"
                onClick={exportToExcel}
                disabled={allTransection.length === 0}
              >
                Export to Excel
                <ExportOutlined />
              </button>
            </div>
          </div>

          <div className="content">
            {loading ? (
              <h4>Loading...</h4>
            ) : viewData === "table" ? (
              <Table columns={columns} dataSource={allTransection} rowKey="transactionId" />
            ) : (
              <Analytics allTransection={allTransection} />
            )}
          </div>
        </div>

        {showModal && (
          <Modal
            title={editable ? "Edit Transaction" : "Add Transaction"}
            visible={showModal}
            onCancel={() => {
              setShowModal(false);
              setEditable(null);
            }}
            footer={null}
          >
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                amount: editable ? editable.amount : "",
                type: editable ? editable.type : "",
                category: editable ? editable.category : "",
                date: editable ? moment(editable.date) : null,
                refrence: editable ? editable.refrence : "",
                description: editable ? editable.description : "",
              }}
            >
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: "Please input amount!" }]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: "Please select type!" }]}
              >
                <Select>
                  <Select.Option value="Income">Income</Select.Option>
                  <Select.Option value="Expense">Expense</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please input category!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select date!" }]}
              >
                <DatePicker />
              </Form.Item>

              <Form.Item label="Reference" name="refrence">
                <Input />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input />
              </Form.Item>

              <Form.Item>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </Layout>
    </>
  );
};

export default HomePage;

