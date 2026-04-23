-- AddForeignKey
ALTER TABLE "BloqueReservado" ADD CONSTRAINT "BloqueReservado_id_bloque_fkey" FOREIGN KEY ("id_bloque") REFERENCES "BloqueHorario"("id_bloque_horario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueReservado" ADD CONSTRAINT "BloqueReservado_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "Reserva"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;
