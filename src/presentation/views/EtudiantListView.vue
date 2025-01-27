<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import EtudiantForm from '@/presentation/components/forms/EtudiantForm.vue';
import CustomTable from '../components/tables/CustomTable.vue';
import { Etudiant } from '@/domain/entities/Etudiant';
import Swal from 'sweetalert2';

const emit = defineEmits(['create:etudiant', 'update:etudiant']);
const etudiantForm = ref<typeof EtudiantForm | null>(null);
const etudiants = ref<Etudiant[]>([]);

// Formatter pour l'icône d'édition
const formatterEdition = (etudiant: Etudiant) => {
  return '<i class="bi bi-pen-fill text-primary"></i>';
};

// Formatter pour l'icône de suppression
const formatterSuppression = (etudiant: Etudiant) => {
  return '<i class="bi bi-trash-fill text-danger"></i>';
};

// Gestion de la suppression d'un étudiant
const handleDelete = (etudiant: Etudiant) => {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: `Vous êtes sur le point de supprimer l'étudiant "${etudiant.Prenom} ${etudiant.Nom}".`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      // Supprimer l'étudiant du localStorage
      const storedEtudiants = JSON.parse(localStorage.getItem('etudiants') || '[]');
      const updatedEtudiants = storedEtudiants.filter((e: Etudiant) => e.ID !== etudiant.ID);
      localStorage.setItem('etudiants', JSON.stringify(updatedEtudiants));

      etudiants.value = updatedEtudiants; // Mettre à jour la liste
      Swal.fire('Supprimé !', "L'étudiant a été supprimé avec succès.", 'success');
    }
  });
};

// Colonnes de la table
const columns = [
  { field: 'EditionEtudiant', label: 'Édition', formatter: formatterEdition, onClick: (e: Etudiant) => etudiantForm.value?.openForm(e), style: 'width: 32px;text-align:center;' },
  { field: 'ID', label: 'ID', formatter: null, onClick: null, style: null },
  { field: 'Nom', label: 'Nom', formatter: null, onClick: null, style: null },
  { field: 'Prenom', label: 'Prénom', formatter: null, onClick: null, style: null },
  { field: 'DeleteEtudiant', label: 'Suppression', formatter: formatterSuppression, onClick: handleDelete, style: 'width: 32px;text-align:center;' },
];

// Charger les étudiants lors du montage
onMounted(() => {
  const storedEtudiants = JSON.parse(localStorage.getItem('etudiants') || '[]');
  etudiants.value = storedEtudiants;
});

// Rafraîchir la liste des étudiants
const refreshEtudiantList = () => {
  const storedEtudiants = JSON.parse(localStorage.getItem('etudiants') || '[]');
  etudiants.value = storedEtudiants;
};
</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header">
        <div class="card-title">
          <h4>Liste des étudiants</h4>
        </div>
        <CustomButton :color="BootstrapButtonEnum.info" @click="() => etudiantForm?.openForm()">
          Ajouter un étudiant
        </CustomButton>
      </div>
      <div class="card-body">
        <CustomTable idAttribute="ID" :columns="columns" :data="etudiants" />
      </div>
    </div>
  </div>
  <EtudiantForm
    ref="etudiantForm"
    :etudiant="null"
    @refresh:etudiants="refreshEtudiantList"
  />
</template>
