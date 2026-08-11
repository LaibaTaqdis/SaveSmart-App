import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ScreenContainer } from "@components/ScreenContainer";
import { Card } from "@components/Card";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuthStore } from "@stores/authStore";
import { useUserStore } from "@stores/userStore";
import { formatCurrency, formatDate } from "@utils/formatters";
import { isPositiveNumber } from "@utils/validators";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid);
  const savingsHistory = useUserStore((s) => s.savingsHistory);
  const loadSavingsHistory = useUserStore((s) => s.loadSavingsHistory);
  const addSavingsEntry = useUserStore((s) => s.addSavingsEntry);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (uid) loadSavingsHistory(uid);
  }, [uid, loadSavingsHistory]);

  const chartData = {
    labels: savingsHistory.slice(0, 6).reverse().map((e) => formatDate(e.createdAt).slice(0, 6)),
    datasets: [{ data: savingsHistory.slice(0, 6).reverse().map((e) => e.amount) || [0] }],
  };

  const handleAddEntry = async () => {
    const numericAmount = Number(amount);
    if (!isPositiveNumber(numericAmount)) {
      Alert.alert("Invalid amount", "Please enter a savings amount greater than zero.");
      return;
    }
    if (!uid) return;

    setSubmitting(true);
    try {
      await addSavingsEntry(uid, numericAmount, note);
      setAmount("");
      setNote("");
    } catch (error) {
      Alert.alert("Error", "Could not log your savings entry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Text className="text-2xl font-bold text-navy mt-4 mb-4">Your Progress</Text>

      <Card className="mb-4">
        <Text className="text-sm font-semibold text-navy mb-2">Savings Trend</Text>
        {savingsHistory.length > 0 ? (
          <LineChart
            data={chartData}
            width={screenWidth - 64}
            height={180}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`,
              labelColor: () => "#6B7280",
            }}
            bezier
            style={{ borderRadius: 12 }}
          />
        ) : (
          <Text className="text-sm text-muted">Log your first savings entry to see your trend here.</Text>
        )}
      </Card>

      <Card className="mb-4">
        <Text className="text-sm font-semibold text-navy mb-3">Log a Savings Entry</Text>
        <Input label="Amount (PKR)" placeholder="1000" keyboardType="numeric" value={amount} onChangeText={setAmount} />
        <Input label="Note (optional)" placeholder="Saved from lunch money" value={note} onChangeText={setNote} />
        <Button label="Add Entry" onPress={handleAddEntry} loading={submitting} />
      </Card>

      <Card>
        <Text className="text-sm font-semibold text-navy mb-3">Recent Entries</Text>
        {savingsHistory.length === 0 ? (
          <Text className="text-sm text-muted">No entries yet.</Text>
        ) : (
          savingsHistory.slice(0, 8).map((entry) => (
            <View key={entry.id} className="flex-row justify-between py-2 border-b border-border">
              <View>
                <Text className="text-sm text-black">{entry.note || "Savings entry"}</Text>
                <Text className="text-xs text-muted">{formatDate(entry.createdAt)}</Text>
              </View>
              <Text className="text-sm font-semibold text-teal">{formatCurrency(entry.amount)}</Text>
            </View>
          ))
        )}
      </Card>
    </ScreenContainer>
  );
}
