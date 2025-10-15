import { apiClient, ApiResponse } from '@/lib/api-client';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  userId?: string;
  orderId?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  serviceId: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'service' | 'installation' | 'consultation';
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleLicense?: string;
  vehicleVin?: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  actualStartTime?: string;
  actualEndTime?: string;
  assignedTechnician?: string;
  notes?: string;
  internalNotes?: string;
  reminderSent: boolean;
  confirmationSent: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  service?: {
    id: string;
    name: string;
    category?: string;
    price?: number;
  };
  user?: {
    id: string;
    name?: string;
    email: string;
    phone?: string;
  };
  technician?: {
    id: string;
    name?: string;
    email: string;
  };
  order?: {
    id: string;
    orderNumber: string;
    total: number;
  };
}

export interface AppointmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  serviceId?: string;
  technicianId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateAppointmentData {
  userId?: string;
  orderId?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  serviceId: string;
  type: 'service' | 'installation' | 'consultation';
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleLicense?: string;
  vehicleVin?: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  assignedTechnician?: string;
  notes?: string;
  internalNotes?: string;
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
  id: string;
  status?: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  actualStartTime?: string;
  actualEndTime?: string;
  reminderSent?: boolean;
  confirmationSent?: boolean;
}

export interface AppointmentStats {
  totalAppointments: number;
  todayAppointments: number;
  scheduledAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageDuration: number;
  upcomingAppointments: number;
  overdueAppointments: number;
}

interface GetAppointmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  serviceId?: string;
  sort?: string;
  sortOrder?: 'asc' | 'desc';
}

class AppointmentApiService {
  // All methods use hardcoded endpoints to avoid initialization issues

  async getAppointments(params?: GetAppointmentsParams): Promise<ApiResponse<Appointment[]>> {
    const endpoint = '/admin/appointments';
    return apiClient.get<Appointment[]>(endpoint, params);
  }

  async getAppointment(id: string): Promise<ApiResponse<Appointment>> {
    const endpoint = `/admin/appointments/${id}`;
    return apiClient.get<Appointment>(endpoint);
  }

  async createAppointment(data: CreateAppointmentData): Promise<ApiResponse<Appointment>> {
    const endpoint = '/admin/appointments';
    return apiClient.post<Appointment>(endpoint, data);
  }

  async updateAppointment(data: UpdateAppointmentData): Promise<ApiResponse<Appointment>> {
    const { id, ...updateData } = data;
    const endpoint = `/admin/appointments/${id}`;
    return apiClient.put<Appointment>(endpoint, updateData);
  }

  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    const endpoint = `/admin/appointments/${id}`;
    return apiClient.delete<void>(endpoint);
  }

  async updateAppointmentStatus(
    id: string, 
    status: Appointment['status']
  ): Promise<ApiResponse<Appointment>> {
    const endpoint = `/admin/appointments/${id}/status`;
    return apiClient.patch<Appointment>(endpoint, { status });
  }

  async getAppointmentStats(): Promise<ApiResponse<AppointmentStats>> {
    const endpoint = '/admin/appointments/stats';
    return apiClient.get<AppointmentStats>(endpoint);
  }

  async getAvailableSlots(
    serviceId: string, 
    date: string
  ): Promise<ApiResponse<string[]>> {
    const endpoint = '/admin/appointments/available-slots';
    return apiClient.get<string[]>(endpoint, {
      serviceId,
      date,
    });
  }

  async sendReminder(id: string): Promise<ApiResponse<void>> {
    const endpoint = `/admin/appointments/${id}/reminder`;
    return apiClient.post<void>(endpoint);
  }

  async sendConfirmation(id: string): Promise<ApiResponse<void>> {
    const endpoint = `/admin/appointments/${id}/confirmation`;
    return apiClient.post<void>(endpoint);
  }

  async rescheduleAppointment(
    id: string,
    scheduledDate: string,
    scheduledTime: string
  ): Promise<ApiResponse<Appointment>> {
    const endpoint = `/admin/appointments/${id}/reschedule`;
    return apiClient.patch<Appointment>(endpoint, {
      scheduledDate,
      scheduledTime,
    });
  }

  async checkInAppointment(id: string): Promise<ApiResponse<Appointment>> {
    const endpoint = `/admin/appointments/${id}/check-in`;
    return apiClient.patch<Appointment>(endpoint, {
      actualStartTime: new Date().toISOString(),
      status: 'in-progress',
    });
  }

  async checkOutAppointment(id: string): Promise<ApiResponse<Appointment>> {
    const endpoint = `/admin/appointments/${id}/check-out`;
    return apiClient.patch<Appointment>(endpoint, {
      actualEndTime: new Date().toISOString(),
      status: 'completed',
    });
  }

  async exportAppointments(filters: AppointmentFilters = {}): Promise<Blob> {
    const params = new URLSearchParams(
      Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)])
    );

    const response = await fetch(`/api/admin/appointments/export?${params}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }
}

export const appointmentApi = new AppointmentApiService();
