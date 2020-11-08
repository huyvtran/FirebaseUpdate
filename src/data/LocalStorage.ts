/**
 * Wrap the AsyncStorage for latter change
 */
import { AsyncStorage } from 'react-native';

export async function get(key: string, callback?: (error?: Error, result?: string) => void) {
    console.log("LocalStorage Get key>>", key)
    const result = await AsyncStorage.getItem(key, callback);
    console.log("LocalStorage Get result>>", result)
    return result;
}

export async function set(key: string, param: any, callback?: (error?: Error) => void) {
    const isString = typeof param === 'string'
    const value = isString ? param : JSON.stringify(param)
    await AsyncStorage.setItem(key, value, callback);
}

export async function remove(key: string, callback?: (error?: Error) => void) {
    await AsyncStorage.removeItem(key, callback);
}