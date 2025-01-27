<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import UEForm from '@/presentation/components/forms/UEForm.vue';
import CustomTable from '../components/tables/CustomTable.vue';
import { UE } from '@/domain/entities/IUE';
import Swal from 'sweetalert2';

const emit = defineEmits(['create:ue', 'update:ue']);
const ueForm = ref<typeof UEForm | null>(null);
const ues = ref<UE[]>([]);

// Formatter pour les icônes d'édition et de suppression
const formatterEdition = (ue: UE) => {
  return '<i class="bi bi-pen-fill text-primary"></i>';
};

const formatterSuppression = (ue: UE) => {
  return '<i class="bi bi-trash-fill text-danger"></i>';
};

// Gestion de la suppression d'une UE
const handleDelete = (ue: UE) => {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: `Vous êtes sur le point de supprimer l'UE "${ue.Intitule}".`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      // Suppression de l'UE dans localStorage
      const storedUEs = JSON.parse(localStorage.getItem('ues') || '[]');
      const updatedUEs = storedUEs.filter((storedUE: UE) => storedUE.ID !== ue.ID);
      localStorage.setItem('ues', JSON.stringify(updatedUEs));

      // Mise à jour de la liste affichée
      ues.value = updatedUEs;
      Swal.fire('Supprimé !', 'L\'UE a été supprimée avec succès.', 'success');
    }
  });
};

// Colonnes de la table
const columns = [
  { field: 'EditionUE', label: 'Edition', formatter: formatterEdition, onClick: (ue: UE) => ueForm.value?.openForm(ue), style: 'width: 32px;text-align:center;' },
  { field: 'ID', label: 'ID', formatter: null, onClick: null, style: null },
  { field: 'NumeroUe', label: 'Numéro', formatter: null, onClick: null, style: null },
  { field: 'Intitule', label: 'Intitulé', formatter: null, onClick: null, style: null },
  { field: 'DeleteUE', label: 'Suppression', formatter: formatterSuppression, onClick: handleDelete, style: 'width: 32px;text-align:center;' },
];

// Chargement initial des UE depuis localStorage
onMounted(() => {
  const storedUEs = JSON.parse(localStorage.getItem('ues') || '[]');
  ues.value = storedUEs;
});

// Rafraîchir la liste des UE
const refreshUEList = () => {
  const storedUEs = JSON.parse(localStorage.getItem('ues') || '[]');
  ues.value = storedUEs;
};
</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header">
        <div class="card-title">
          <h4>Liste des unités d'enseignement (UE)</h4>
        </div>
        <CustomButton :color="BootstrapButtonEnum.info" @click="() => ueForm?.openForm()">
          Ajouter une UE
        </CustomButton>
      </div>
      <div class="card-body">
        <CustomTable idAttribute="ID" :columns="columns" :data="ues" />
      </div>
    </div>
  </div>
  <UEForm ref="ueForm" :ue="null" @refresh:ue="refreshUEList" @create:ue="refreshUEList" @update:ue="refreshUEList" />
</template>
