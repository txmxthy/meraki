import React, { useState, useContext, useEffect } from "react";
import { Text, View } from "react-native";
import { getTodoList, todoCountOverdue, TodoItem } from "../models/Todo";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import Firebase from "../config/firebase";
import type firebase from "firebase";
import { TodoButton } from "../components/TodoButton";
import { NavigationProp } from "@react-navigation/core";
import { ScrollView } from "react-native-gesture-handler";
import { OverdueItemsContext } from "../context/OverdueItemsContext";

export default function GlobaScreen({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const [, setOverdueCount] = useContext(OverdueItemsContext);

  const [todos, setTodos] = useState<TodoItem[] | undefined>();
  const { user } = useContext<any>(AuthenticatedUserContext);

  useEffect(() => {
    if (!todos) {
      getTodoList(user.uid).then((todos) => {
        setOverdueCount(todoCountOverdue(todos));
        setTodos(
          todos
            .filter((val) => val.progress < 1)
            .sort(
              (a, b) =>
                new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf()
            )
        );
      });
    }

    // Prompt an update when we focus this screen again
    const unsubFocus = navigation.addListener("focus", () => {
      setTodos(undefined);
    });

    return () => {
      unsubFocus();
    };
  }, [todos, setTodos, user]);

  return (
    <ScrollView style={{ margin: 4 }}>
      {todos?.map((todo, index) => (
        <TodoButton
          key={index}
          todo={todo}
          onPress={() => navigation.navigate("Todo/Edit", { todo })}
        />
      ))}
    </ScrollView>
  );
}
