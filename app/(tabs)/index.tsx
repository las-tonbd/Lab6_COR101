import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { api } from "@/scripts/api";
import Icon from "react-native-vector-icons/FontAwesome";

type Users = {
  id: string;
  name: string;
  dob: string;
  avatar: string;
};

type ItemProps = {
  user: Users;
  onDelete: (userId: string) => void;
  onUpdate: (user: Users) => void;
};

const Item = ({ user, onDelete, onUpdate }: ItemProps) => {
  const [modalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [name, setName] = useState(user.name);
  const [dob, setDob] = useState(user.dob);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleUpdate = async () => {
    try {
      const updateUser = { name, dob, avatar };
      if (!name.trim()) {
        alert("Tên không được để trống!");
        return;
      }
      if (!dob.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        alert("Ngày sinh không hợp lệ! Định dạng đúng: YYYY-MM-DD");
        return;
      }
      if (
        !avatar.trim() ||
        !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(avatar)
      ) {
        alert("URL ảnh không hợp lệ! Phải là đường dẫn hợp lệ.");
        return;
      }
      const response = await api.put(`/users/${user.id}`, updateUser);
      onUpdate(response);
      setModalVisibleUpdate(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/users/${user.id}`);
      onDelete(user.id);
      setModalVisibleDelete(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <View
      style={{
        alignItems: "center",
        padding: 10,
        backgroundColor: "#FFFF99",
        margin: 10,
        borderRadius: 10,
        borderColor: "gray",
        borderWidth: 2,
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Image
          style={styles.styleImg}
          source={{
            uri: user.avatar,
          }}
        />
        <View
          style={{
            marginLeft: 10,
            justifyContent: "center",

            flex: 1,
          }}
        >
          <Text style={styles.textName}>{user.name}</Text>
          <Text style={styles.textBod}>{user.dob} </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: 300,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={styles.containerBtnUpdate}
          onPress={() => {
            setModalVisibleUpdate(true);
          }}
        >
          <Text style={styles.textUpdate}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.containerBtnDelete}
          onPress={() => {
            setModalVisibleDelete(true);
          }}
        >
          <Text style={styles.textUpdate}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* model sửa */}
      <Modal
        visible={modalVisibleUpdate}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.containerModal}>
          <View style={styles.contentModal}>
            <Text style={styles.titleModal}>Cập nhật</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Nhập vào họ và tên"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Nhập vào ngày sinh"
              value={dob}
              onChangeText={setDob}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Nhập vào avatar"
              value={avatar}
              onChangeText={setAvatar}
            />
            <View
              style={{
                flexDirection: "row",
                width: 210,
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={styles.containerBtnUpdate}
                onPress={handleUpdate}
              >
                <Text style={styles.textUpdate}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.containerBtnUpdate}
                onPress={() => {
                  setModalVisibleUpdate(false);
                }}
              >
                <Text style={styles.textUpdate}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* modal xóa */}
      <Modal
        visible={modalVisibleDelete}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.containerModal}>
          <View style={styles.contentModal}>
            <Text style={styles.titleModal}>Xóa người dùng</Text>
            <Text style={{ fontSize: 20, color: "red", margin: 10 }}>
              Bạn có muốn xóa không
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: 210,
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={styles.containerBtnUpdate}
                onPress={handleDeleteUser}
              >
                <Text style={styles.textUpdate}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.containerBtnUpdate}
                onPress={() => {
                  setModalVisibleDelete(false);
                }}
              >
                <Text style={styles.textUpdate}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function index() {
  const [userList, setUserList] = useState<Users[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [avatar, setAvatar] = useState("");
  const fetch = async () => {
    try {
      const response = await api.get("/users");
      setUserList(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  const addUsers = async () => {
    if (!name.trim()) {
      alert("Tên không được để trống!");
      return;
    }
    if (!dob.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      alert("Ngày sinh không hợp lệ! Định dạng đúng: YYYY-MM-DD");
      return;
    }
    if (!avatar.trim() || !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(avatar)) {
      alert("URL ảnh không hợp lệ! Phải là đường dẫn hợp lệ.");
      return;
    }
    try {
      const newUser = { name: name, dob: dob, avatar: avatar };
      const response = await api.post("/users", newUser);
      setUserList((prev) => [...prev, response]);
      setModalVisible(false);
      setName("");
      setDob("");
      setAvatar("");
    } catch (error) {
      console.log("loi " + error);
    }
  };
  const handleUpdateUser = (updatedUser: Users) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const handleDeleteUser = (deletedUserId: string) => {
    setUserList((prev) => prev.filter((u) => u.id !== deletedUserId));
  };

  return (
    <View>
      <FlatList
        data={userList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item
            user={item}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
          />
        )}
      />
      {/* Them user */}

      <TouchableOpacity
        style={styles.styleButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Icon name="plus" size={20} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.containerModal}>
          <View style={styles.contentModal}>
            <Text style={styles.titleModal}>Thêm người dùng</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Nhập vào họ và tên"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Nhập vào ngày sinh"
              value={dob}
              onChangeText={setDob}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Nhập vào avatar"
              value={avatar}
              onChangeText={setAvatar}
            />
            <View
              style={{
                flexDirection: "row",
                width: 210,
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={styles.containerBtnUpdate}
                onPress={addUsers}
              >
                <Text style={styles.textUpdate}>Thêm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.containerBtnUpdate}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={styles.textUpdate}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  styleImg: {
    height: 100,
    width: 100,
  },
  textName: {
    fontWeight: "500",
    fontSize: 20,
  },
  textBod: {
    fontWeight: "500",
    fontSize: 18,
  },
  containerBtnUpdate: {
    width: 100,
    backgroundColor: "#0099FF",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  containerBtnDelete: {
    width: 100,
    backgroundColor: "red",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textDelete: {},
  textUpdate: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  styleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentModal: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  titleModal: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputText: {
    height: 40,
    width: 300,

    borderRadius: 20,
    borderColor: "#33CCFF",
    borderWidth: 1,
    marginTop: 10,
  },
});
