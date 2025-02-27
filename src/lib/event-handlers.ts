/**
 * @module 画布事件处理器模块
 * @remarks
 * 实现与画布交互相关的通用事件处理逻辑，采用高阶函数封装状态
 * 包含滚轮缩放、拖拽平移等核心交互功能的纯函数实现
 * 
 * @example
 * ```ts
 * // 在画布初始化后绑定事件处理器
 * const canvas = initializeCanvas();
 * canvas.on('mouse:wheel', createWheelHandler(canvas));
 * ```
 */
import { Point, Canvas, TEvent } from "fabric";
import { calculateZoom } from "./utils";

// Type definitions for event data
interface EventData {
  timestamp: number;
  source: string;
}

// Custom event types
interface UserEventData extends EventData {
  userId: string;
  action: 'login' | 'logout' | 'purchase';
  metadata?: Record<string, any>;
}

interface SystemEventData extends EventData {
  level: 'info' | 'warning' | 'error';
  message: string;
  code?: number;
}

// Canvas specific event data
interface CanvasEventData extends EventData {
  canvasId: string;
  action: 'zoom' | 'pan' | 'draw' | 'select' | 'modify';
  details?: Record<string, any>;
}

// Event handler type definitions
type EventHandler<T extends EventData> = (data: T) => void;
type UnsubscribeFn = () => void;

// Event manager class
class EventManager {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  // Register an event handler
  public on<T extends EventData>(eventName: string, handler: EventHandler<T>): UnsubscribeFn {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    
    const handlers = this.handlers.get(eventName)!;
    handlers.push(handler);
    
    // Return unsubscribe function
    return () => {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    };
  }

  // Emit an event
  public emit<T extends EventData>(eventName: string, data: T): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in ${eventName} event handler:`, error);
      }
    });
  }

  // Remove all handlers for an event
  public off(eventName: string): void {
    this.handlers.delete(eventName);
  }
}

// Create a singleton instance
export const eventManager = new EventManager();

/**
 * 创建滚轮事件处理器的高阶函数
 * 通过闭包绑定特定 canvas 实例，实现无状态事件处理
 * 符合函数式编程的纯函数原则（除入参外无外部依赖）
 */
export const createWheelHandler =
  (canvas: Canvas) => (opt: TEvent<WheelEvent>) => {
    // 从事件对象解构需要的参数
    const { deltaY: delta, offsetX, offsetY } = opt.e;
    
    // 创建基于鼠标位置的缩放锚点
    const zoomPoint = new Point(offsetX, offsetY);

    // 调用工具函数计算新缩放比例并应用
    const newZoom = calculateZoom(canvas.getZoom(), delta);
    canvas.zoomToPoint(zoomPoint, newZoom);

    // 发出画布缩放事件
    eventManager.emit<CanvasEventData>('canvas:zoom', {
      timestamp: Date.now(),
      source: 'wheel',
      canvasId: canvas.lowerCanvasEl.id,
      action: 'zoom',
      details: {
        zoomPoint: { x: offsetX, y: offsetY },
        zoomLevel: newZoom
      }
    });

    // 阻止事件冒泡和默认行为（避免页面滚动）
    opt.e.preventDefault();
    opt.e.stopPropagation();
  };

// Canvas event subscription helpers
export function onCanvasZoom(handler: EventHandler<CanvasEventData>): UnsubscribeFn {
  return eventManager.on<CanvasEventData>('canvas:zoom', handler);
}

export function onCanvasPan(handler: EventHandler<CanvasEventData>): UnsubscribeFn {
  return eventManager.on<CanvasEventData>('canvas:pan', handler);
}

export function onCanvasDraw(handler: EventHandler<CanvasEventData>): UnsubscribeFn {
  return eventManager.on<CanvasEventData>('canvas:draw', handler);
}

export function onCanvasSelect(handler: EventHandler<CanvasEventData>): UnsubscribeFn {
  return eventManager.on<CanvasEventData>('canvas:select', handler);
}

export function onCanvasModify(handler: EventHandler<CanvasEventData>): UnsubscribeFn {
  return eventManager.on<CanvasEventData>('canvas:modify', handler);
}

// System event subscription helpers
export function onSystemEvent(handler: EventHandler<SystemEventData>): UnsubscribeFn {
  return eventManager.on<SystemEventData>('system', handler);
}

// Example of emitting a system event
export function logSystemError(message: string, code?: number): void {
  eventManager.emit<SystemEventData>('system', {
    timestamp: Date.now(),
    source: 'application',
    level: 'error',
    message,
    code
  });
}
